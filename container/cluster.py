<<<<<<< HEAD
import asyncio
from dataclasses import dataclass
import hashlib
import hmac
import io
import os
from pathlib import Path
import time
import aiofiles
import aiohttp
from typing import Any
import socketio
import config
from timer import Timer # type: ignore
import pyzstd as zstd
from avro import schema, io as avro_io  
import utils
import stats
import web

PY_VERSION = "1.0.0"
VERSION = "1.9.7"
UA = f"openbmclapi-cluster/{VERSION} Python/{PY_VERSION}"
URL = 'https://openbmclapi.bangbang93.com/'
COUNTER = stats.Counters()

@dataclass
class BMCLAPIFile:
    path: str
    hash: str
    size: int

class TokenManager:
    def __init__(self) -> None:
        self.token = None
    async def fetchToken(self):
        async with aiohttp.ClientSession(headers={
            "User-Agent": UA
        }, base_url=URL) as session:  
            try:  
                async with session.get("/openbmclapi-agent/challenge", params={"clusterId": config.CLUSTER_ID}) as req:  
                    req.raise_for_status()  
                    challenge: str = (await req.json())['challenge']  
                      
                signature = hmac.new(config.CLUSTER_SECRET.encode("utf-8"), digestmod=hashlib.sha256)  
                signature.update(challenge.encode())  
                signature = signature.hexdigest()  
                  
                data = {  
                    "clusterId": config.CLUSTER_ID,  
                    "challenge": challenge,  
                    "signature": signature  
                }  
                  
                async with session.post("/openbmclapi-agent/token", json=data) as req:  
                    req.raise_for_status()  
                    content: dict[str, Any] = await req.json()  
                    self.token = content['token']  
                    Timer.delay(self.fetchToken, delay=float(content['ttl']) / 1000.0 - 600)
              
            except aiohttp.ClientError as e:  
                print(f"Error fetching token: {e}")  
    async def getToken(self) -> str:  
        if not self.token:  
            await self.fetchToken()
        return self.token or ''
    
class Progress:
    def __init__(self, data, func) -> None:
        self.func = func
        self.data = data
        self.total = len(data)
        self.cur = 0
        self.cur_speed = 0
        self.cur_time = time.time()
    def process(self):
        for data in self.data:
            self.func(data)
            self.cur += 1
            self.cur_speed += 1
            yield self.cur, self.total
            if time.time() - self.cur_time >= 1:
                self.cur_speed = 0

class FileStorage:
    def __init__(self, dir: Path) -> None:
        self.dir = dir
        if self.dir.is_file():
            raise FileExistsError("The path is file.")
        self.dir.mkdir(exist_ok=True, parents=True)
        self.files: asyncio.Queue[BMCLAPIFile] = asyncio.Queue()
        self.download_bytes = utils.Progress(5)
        self.download_files = utils.Progress(5)
        self.sio = socketio.AsyncClient()
        self.keepalive = None
    async def download(self, session: aiohttp.ClientSession):
        while not self.files.empty():
            file = await self.files.get()
            hash = utils.get_hash(file.hash)
            size = 0
            filepath = Path(str(self.dir) + "/" + file.hash[:2] + "/" + file.hash)
            try:
                async with session.get(file.path) as resp:
                    filepath.parent.mkdir(exist_ok=True, parents=True)
                    async with aiofiles.open(filepath, "wb") as w:
                        while data := await resp.content.read(config.IO_BUFFER):
                            if not data:
                                break
                            byte = len(data)
                            size += byte
                            self.download_bytes.add(byte)
                            await w.write(data)
                            hash.update(data)
                if file.hash != hash.hexdigest():
                    filepath.unlink(True)
                    raise EOFError
                self.download_files.add()
            except:
                self.download_bytes.add(-size)
                await self.files.put(file)
    async def check_file(self):
        print("Requesting files...")
        filelist = await self.get_file_list()
        filesize = sum((file.size for file in filelist))
        total = len(filelist)
        byte = 0
        miss = []
        for i, file in enumerate(filelist):
            filepath = Path(str(self.dir) + f"/{file.hash[:2]}/{file.hash}")
            if not filepath.exists() or filepath.stat().st_size != file.size:
                miss.append(file)
                await asyncio.sleep(0)
            b = utils.calc_more_bytes(byte, filesize)
            byte += file.size
            print(f"<<<flush>>>Check file {i}/{total} ({b[0]}/{b[1]})")
        if not miss:
            print(f"<<<flush>>>Checked all files!")
            await self.start_service()
            return
        filelist = miss
        filesize = sum((file.size for file in filelist))
        total = len(filelist)
        print(f"<<<flush>>>Missing files: {total}({utils.calc_bytes(filesize)})")
        for file in filelist:
            await self.files.put(file)
        self.download_bytes = utils.Progress(5, filesize)
        self.download_files = utils.Progress(5)
        timers = []
        for _ in range(0, config.MAX_DOWNLOAD, 32):
            for __ in range(32):
                timers.append(Timer.delay(self.download, args=(aiohttp.ClientSession(URL, headers={
                    "User-Agent": UA,
                    "Authorization": f"Bearer {await token.getToken()}"
                }), )))
        while any([not timer.called for timer in timers]):
            b = utils.calc_more_bytes(self.download_bytes.get_cur(), filesize)
            bits = self.download_bytes.get_cur_speeds() or [0]
            minbit = min(bits)
            bit = utils.calc_more_bit(minbit, bits[-1], max(bits))
            eta = self.download_bytes.get_eta()
            print(f"<<<flush>>>Downloading files... {self.download_files.get_cur()}/{total} {b[0]}/{b[1]}, eta: {utils.format_time(eta if eta != -1 else None)}, total: {utils.format_time(self.download_bytes.get_total())}, Min: {bit[0]}, Cur: {bit[2]}, Max: {bit[1]}, Files: {self.download_files.get_cur_speed()}/s")
            await asyncio.sleep(1)
        await self.start_service()
    async def start_service(self):
        tokens = await token.getToken()
        await self.sio.connect(URL, 
            transports=['websocket'],
            auth={"token": tokens},
        ) # type: ignore
        await self.enable()
    async def enable(self):
        if not self.sio.connected: 
            return
        await self.emit("enable", {
            "host": config.PUBLICHOST,
            "port": config.PUBLICPORT or config.PORT,
            "version": VERSION,
            "byoc": config.BYOC,
            "noFastEnable": False
        })
        if not (Path(".ssl/cert.pem").exists() and Path(".ssl/key.pem").exists()):
            await self.emit("request-cert")
        self.cur_counter = stats.Counters()
        print("Connected Main Server.")
    async def message(self, type, data):
        if type == "request-cert":
            cert = data[1]
            print("Requested cert!")
            cert_file = Path(".ssl/cert.pem")
            key_file = Path(".ssl/key.pem")
            for file in (cert_file, key_file):
                file.parent.mkdir(exist_ok=True, parents=True)
            with open(cert_file, "w") as w:
                w.write(cert['cert'])
            with open(key_file, "w") as w:
                w.write(cert['key'])
            web.load_cert()
            cert_file.unlink()
            key_file.unlink()
        elif type == "enable":
            if self.keepalive:
                self.keepalive.block()
            self.keepalive = Timer.delay(self.keepaliveTimer, (), 5)
            if len(data) == 2 and data[1] == True:
                print("Checked! Can service")
                return
            print("Error:" + data[0]['message'])
            Timer.delay(self.enable)
        elif type == "keep-alive":
            COUNTER.hit -= self.cur_counter.hit
            COUNTER.bytes -= self.cur_counter.bytes
            self.keepalive = Timer.delay(self.keepaliveTimer, (), 5)
    async def keepaliveTimer(self):
        self.cur_counter.hit = COUNTER.hit
        self.cur_counter.bytes = COUNTER.bytes
        await self.emit("keep-alive", {
            "time": time.time(),
            "hits": self.cur_counter.hit,
            "bytes": self.cur_counter.bytes
        })
    async def emit(self, channel, data = None):
        await self.sio.emit(channel, data, callback=lambda x: Timer.delay(self.message, (channel, x)))
    async def get_file_list(self):
        async with aiohttp.ClientSession(headers={
            "User-Agent": UA,
            "Authorization": f"Bearer {await token.getToken()}"
        }, base_url=URL) as session:  
            async with session.get('/openbmclapi/files', data={
                "responseType": "buffer",
                "cache": ""
            }) as req:  
                req.raise_for_status()  
                print("Requested files")
        
                parser = avro_io.DatumReader(schema.parse(
'''  
{  
  "type": "array",  
  "items": {  
    "type": "record",  
    "name": "FileList",  
    "fields": [  
      {"name": "path", "type": "string"},  
      {"name": "hash", "type": "string"},  
      {"name": "size", "type": "long"}  
    ]  
  }  
}  
'''  ))
                decoder = avro_io.BinaryDecoder(io.BytesIO(zstd.decompress(await req.read())))  
                return [BMCLAPIFile(**file) for file in parser.read(decoder)]
    
class FileCache:
    def __init__(self, file: Path) -> None:
        self.buf = io.BytesIO()
        self.size = 0
        self.last_file = 0
        self.last = 0
        self.file = file
        self.access = 0
    async def __call__(self) -> io.BytesIO:
        self.access = time.time()
        if self.last < time.time():
            stat = self.file.stat()
            if self.size == stat.st_size and self.last_file == stat.st_mtime:
                self.last = time.time() + 600
                return self.buf
            self.buf.seek(0, os.SEEK_SET)
            async with aiofiles.open(self.file, "rb") as r:
                while (data := await r.read(min(config.IO_BUFFER, stat.st_size - self.buf.tell()))) and self.buf.tell() < stat.st_size:
                    self.buf.write(data)
                self.last = time.time() + 600
                self.size = stat.st_size
                self.last_file = stat.st_mtime
            self.buf.seek(0, os.SEEK_SET)
        return self.buf
cache: dict[str, FileCache] = {}
token = TokenManager()
storage: FileStorage = FileStorage(Path("bmclapi"))
async def init():
    global storage
    #Timer.delay(storage.check_file)
    app = web.app
    @app.get("/measure/{size}")
    async def _(request: web.Request, size: int, s: str, e: str):
        #if not config.SKIP_SIGN:
        #    check_sign(request.protocol + "://" + request.host + request.path, config.CLUSTER_SECRET, s, e)
        async def iter(size):
            for _ in range(size):
                yield b'\x00' * 1024 * 1024
        return web.Response(iter(size))

    @app.get("/download/{hash}")
    async def _(request: web.Request, hash: str, s: str, e: str):
        #if not config.SKIP_SIGN:
        #    check_sign(request.protocol + "://" + request.host + request.path, config.CLUSTER_SECRET, s, e)
        file = Path(str(storage.dir) + "/" + hash[:2] + "/" + hash)
        if not file.exists():
            return web.Response(status_code=404)
        if hash not in cache:
            cache[hash] = FileCache(file)
        data = await cache[hash]()
        COUNTER.bytes += len(data.getbuffer())
        COUNTER.hit += 1
        return data.getbuffer()
    router: web.Router = web.Router("/bmcl")
    @router.get("/")
    async def _(request: web.Request):
        print(request.get_ip())
    app.mount(router)

async def clearCache():
    global cache
    data = cache.copy()
    size = 0
    for k, v in data.items():
        if v.access + 60 < time.time():
            cache.pop(k)
        else:
            size += v.size
    if size > 1024 * 1024 * 512:
        data = cache.copy()
        for k, v in data.items():
            if size > 1024 * 1024 * 512:
                cache.pop(k)
                size -= v.size
            else:
                break


=======
import asyncio
from dataclasses import dataclass
import hashlib
import hmac
import io
import os
from pathlib import Path
import time
import aiofiles
import aiohttp
from typing import Any
import socketio
import config
from timer import Timer # type: ignore
import pyzstd as zstd
from avro import schema, io as avro_io  
import utils
import stats
import web

PY_VERSION = "1.0.0"
VERSION = "1.9.7"
UA = f"openbmclapi-cluster/{VERSION} Python/{PY_VERSION}"
URL = 'https://openbmclapi.bangbang93.com/'
COUNTER = stats.Counters()

@dataclass
class BMCLAPIFile:
    path: str
    hash: str
    size: int

class TokenManager:
    def __init__(self) -> None:
        self.token = None
    async def fetchToken(self):
        async with aiohttp.ClientSession(headers={
            "User-Agent": UA
        }, base_url=URL) as session:  
            try:  
                async with session.get("/openbmclapi-agent/challenge", params={"clusterId": config.CLUSTER_ID}) as req:  
                    req.raise_for_status()  
                    challenge: str = (await req.json())['challenge']  
                      
                signature = hmac.new(config.CLUSTER_SECRET.encode("utf-8"), digestmod=hashlib.sha256)  
                signature.update(challenge.encode())  
                signature = signature.hexdigest()  
                  
                data = {  
                    "clusterId": config.CLUSTER_ID,  
                    "challenge": challenge,  
                    "signature": signature  
                }  
                  
                async with session.post("/openbmclapi-agent/token", json=data) as req:  
                    req.raise_for_status()  
                    content: dict[str, Any] = await req.json()  
                    self.token = content['token']  
                    Timer.delay(self.fetchToken, delay=float(content['ttl']) / 1000.0 - 600)
              
            except aiohttp.ClientError as e:  
                print(f"Error fetching token: {e}")  
    async def getToken(self) -> str:  
        if not self.token:  
            await self.fetchToken()
        return self.token or ''
    
class Progress:
    def __init__(self, data, func) -> None:
        self.func = func
        self.data = data
        self.total = len(data)
        self.cur = 0
        self.cur_speed = 0
        self.cur_time = time.time()
    def process(self):
        for data in self.data:
            self.func(data)
            self.cur += 1
            self.cur_speed += 1
            yield self.cur, self.total
            if time.time() - self.cur_time >= 1:
                self.cur_speed = 0

class FileStorage:
    def __init__(self, dir: Path) -> None:
        self.dir = dir
        if self.dir.is_file():
            raise FileExistsError("The path is file.")
        self.dir.mkdir(exist_ok=True, parents=True)
        self.files: asyncio.Queue[BMCLAPIFile] = asyncio.Queue()
        self.download_bytes = utils.Progress(5)
        self.download_files = utils.Progress(5)
        self.sio = socketio.AsyncClient()
        self.keepalive = None
    async def download(self, session: aiohttp.ClientSession):
        while not self.files.empty():
            file = await self.files.get()
            hash = utils.get_hash(file.hash)
            size = 0
            filepath = Path(str(self.dir) + "/" + file.hash[:2] + "/" + file.hash)
            try:
                async with session.get(file.path) as resp:
                    filepath.parent.mkdir(exist_ok=True, parents=True)
                    async with aiofiles.open(filepath, "wb") as w:
                        while data := await resp.content.read(config.IO_BUFFER):
                            if not data:
                                break
                            byte = len(data)
                            size += byte
                            self.download_bytes.add(byte)
                            await w.write(data)
                            hash.update(data)
                if file.hash != hash.hexdigest():
                    filepath.unlink(True)
                    raise EOFError
                self.download_files.add()
            except:
                self.download_bytes.add(-size)
                await self.files.put(file)
    async def check_file(self):
        print("Requesting files...")
        filelist = await self.get_file_list()
        filesize = sum((file.size for file in filelist))
        total = len(filelist)
        byte = 0
        miss = []
        for i, file in enumerate(filelist):
            filepath = Path(str(self.dir) + f"/{file.hash[:2]}/{file.hash}")
            if not filepath.exists() or filepath.stat().st_size != file.size:
                miss.append(file)
                await asyncio.sleep(0)
            b = utils.calc_more_bytes(byte, filesize)
            byte += file.size
            print(f"<<<flush>>>Check file {i}/{total} ({b[0]}/{b[1]}): {file.path}")
        if not miss:
            print(f"<<<flush>>>Checked all files!")
            await self.start_service()
            return
        filelist = miss
        filesize = sum((file.size for file in filelist))
        total = len(filelist)
        print(f"<<<flush>>>Missing files: {total}({utils.calc_bytes(filesize)})")
        for file in filelist:
            await self.files.put(file)
        self.download_bytes = utils.Progress(5, filesize)
        self.download_files = utils.Progress(5)
        timers = []
        for _ in range(0, config.MAX_DOWNLOAD, 32):
            for __ in range(32):
                timers.append(Timer.delay(self.download, args=(aiohttp.ClientSession(URL, headers={
                    "User-Agent": UA,
                    "Authorization": f"Bearer {await token.getToken()}"
                }), )))
        while any([not timer.called for timer in timers]):
            b = utils.calc_more_bytes(self.download_bytes.get_cur(), filesize)
            bits = self.download_bytes.get_cur_speeds() or [0]
            minbit = min(bits)
            bit = utils.calc_more_bit(minbit, bits[-1], max(bits))
            eta = self.download_bytes.get_eta()
            print(f"<<<flush>>>Downloading files... {self.download_files.get_cur()}/{total} {b[0]}/{b[1]}, eta: {utils.format_time(eta if eta != -1 else None)}, total: {utils.format_time(self.download_bytes.get_total())}, Min: {bit[0]}, Cur: {bit[2]}, Max: {bit[1]}, Files: {self.download_files.get_cur_speed()}/s")
            await asyncio.sleep(1)
        await self.start_service()
    async def start_service(self):
        tokens = await token.getToken()
        await self.sio.connect(URL, 
            transports=['websocket'],
            auth={"token": tokens},
        ) # type: ignore
        await self.enable()
    async def enable(self):
        if not self.sio.connected: 
            return
        await self.emit("enable", {
            "host": config.PUBLICHOST,
            "port": config.PUBLICPORT or config.PORT,
            "version": VERSION,
            "byoc": config.BYOC,
            "noFastEnable": False
        })
        if not (Path(".ssl/cert.pem").exists() and Path(".ssl/key.pem").exists()):
            await self.emit("request-cert")
        self.cur_counter = stats.Counters()
        print("Connected Main Server.")
    async def message(self, type, data):
        if type == "request-cert":
            cert = data[1]
            print("Requested cert!")
            cert_file = Path(".ssl/cert.pem")
            key_file = Path(".ssl/key.pem")
            for file in (cert_file, key_file):
                file.parent.mkdir(exist_ok=True, parents=True)
            with open(cert_file, "w") as w:
                w.write(cert['cert'])
            with open(key_file, "w") as w:
                w.write(cert['key'])
            exit(0)
        elif type == "enable":
            if self.keepalive:
                self.keepalive.block()
            self.keepalive = Timer.delay(self.keepaliveTimer, (), 5)
            if len(data) == 2 and data[1] == True:
                print("Checked! Can service")
                return
            print("Error:" + data[0]['message'])
            Timer.delay(self.enable)
        elif type == "keep-alive":
            COUNTER.hit -= self.cur_counter.hit
            COUNTER.bytes -= self.cur_counter.bytes
            self.keepalive = Timer.delay(self.keepaliveTimer, (), 5)
    async def keepaliveTimer(self):
        self.cur_counter.hit = COUNTER.hit
        self.cur_counter.bytes = COUNTER.bytes
        await self.emit("keep-alive", {
            "time": time.time(),
            "hits": self.cur_counter.hit,
            "bytes": self.cur_counter.bytes
        })
    async def emit(self, channel, data = None):
        await self.sio.emit(channel, data, callback=lambda x: Timer.delay(self.message, (channel, x)))
    async def get_file_list(self):
        async with aiohttp.ClientSession(headers={
            "User-Agent": UA,
            "Authorization": f"Bearer {await token.getToken()}"
        }, base_url=URL) as session:  
            async with session.get('/openbmclapi/files', data={
                "responseType": "buffer",
                "cache": ""
            }) as req:  
                req.raise_for_status()  
                print("Requested files")
        
                parser = avro_io.DatumReader(schema.parse(
'''  
{  
  "type": "array",  
  "items": {  
    "type": "record",  
    "name": "FileList",  
    "fields": [  
      {"name": "path", "type": "string"},  
      {"name": "hash", "type": "string"},  
      {"name": "size", "type": "long"}  
    ]  
  }  
}  
'''  ))
                decoder = avro_io.BinaryDecoder(io.BytesIO(zstd.decompress(await req.read())))  
                return [BMCLAPIFile(**file) for file in parser.read(decoder)]
    
class FileCache:
    def __init__(self, file: Path) -> None:
        self.buf = io.BytesIO()
        self.size = 0
        self.last_file = 0
        self.last = 0
        self.file = file
        self.access = 0
    async def __call__(self) -> io.BytesIO:
        self.access = time.time()
        if self.last < time.time():
            stat = self.file.stat()
            if self.size == stat.st_size and self.last_file == stat.st_mtime:
                self.last = time.time() + 600
                return self.buf
            self.buf.seek(0, os.SEEK_SET)
            async with aiofiles.open(self.file, "rb") as r:
                while (data := await r.read(min(config.IO_BUFFER, stat.st_size - self.buf.tell()))) and self.buf.tell() < stat.st_size:
                    self.buf.write(data)
                self.last = time.time() + 600
                self.size = stat.st_size
                self.last_file = stat.st_mtime
            self.buf.seek(0, os.SEEK_SET)
        return self.buf
cache: dict[str, FileCache] = {}
token = TokenManager()
storage: FileStorage = FileStorage(Path("bmclapi"))
async def init():
    global storage
    Timer.delay(storage.check_file)
    app = web.app
    @app.get("/measure/{size}")
    async def _(request: web.Request, size: int, s: str, e: str):
        #if not config.SKIP_SIGN:
        #    check_sign(request.protocol + "://" + request.host + request.path, config.CLUSTER_SECRET, s, e)
        async def iter(size):
            for _ in range(size):
                yield b'\x00' * 1024 * 1024
        return web.Response(iter(size))

    @app.get("/download/{hash}")
    async def _(request: web.Request, hash: str, s: str, e: str):
        #if not config.SKIP_SIGN:
        #    check_sign(request.protocol + "://" + request.host + request.path, config.CLUSTER_SECRET, s, e)
        file = Path(str(storage.dir) + "/" + hash[:2] + "/" + hash)
        if not file.exists():
            return web.Response(status_code=404)
        if hash not in cache:
            cache[hash] = FileCache(file)
        data = await cache[hash]()
        COUNTER.bytes += len(data.getbuffer())
        COUNTER.hit += 1
        return data.getbuffer()

async def clearCache():
    global cache
    data = cache.copy()
    size = 0
    for k, v in data.items():
        if v.access + 60 < time.time():
            cache.pop(k)
        else:
            size += v.size
    if size > 1024 * 1024 * 512:
        data = cache.copy()
        for k, v in data.items():
            if size > 1024 * 1024 * 512:
                cache.pop(k)
                size -= v.size
            else:
                break


>>>>>>> 1821e9a699e53437109088d3d8cf4bb4a1bf9a50
Timer.repeat(clearCache, (), 5, 10)
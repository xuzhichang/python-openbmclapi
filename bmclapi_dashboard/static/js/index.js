﻿(() => {
    const ttb = new TTB();
    const global_styles = {
        "body,ol,ul,h1,h2,h3,h4,h5,h6,p,th,td,dl,dd,form,fieldset,legend,input,textarea,select": "margin:0;padding:0",
        "body": "font:12px;background:#fff;-webkit-text-size-adjust:100%",
        "a": "color:#172c45;text-decoration:none",
        "em": "font-style:normal",
        "li": "list-style:none",
        "img": "border:0;vertical-align:middle",
        "table": "border-collapse:collapse;border-spacing:0",
        "p": "word-wrap:break-word",
        ":root": [
            "--r-main-background-color: #F6F7F9",
            "--r-background-color: #191919",
            "--r-main-font-size: 42px",
            "--r-main-color: #fff",
            "--r-block-margin: 20px",
            "--r-heading-margin: 0 0 20px 0",
            "--r-heading-font: Source Sans Pro, Helvetica, sans-serif",
            "--r-heading-color: #fff",
            "--r-heading-line-height: 1.2",
            "--r-heading-letter-spacing: normal",
            "--r-heading-text-transform: uppercase",
            "--r-heading-text-shadow: none",
            "--r-heading-font-weight: 600",
            "--r-heading1-text-shadow: none",
            "--r-heading1-size: 2.5em",
            "--r-heading2-size: 1.6em",
            "--r-heading3-size: 1.3em",
            "--r-heading4-size: 1em",
            "--r-code-font: monospace",
            "--r-link-color: #42affa",
            "--r-link-color-dark: #068de9",
            "--r-link-color-hover: #8dcffc",
            "--r-selection-background-color: rgba(66, 175, 250, .75)",
            "--r-selection-color: #fff",
            "--r-overlay-element-bg-color: 240, 240, 240",
            "--r-overlay-element-fg-color: 0, 0, 0",
            "--r-ligting-color: rgb(15, 198, 194);"
        ],
        ".root .left": [
            "position: fixed",
            "min-height: calc(100vh - 72px)",
            "max-height: calc(100vh - 72px)",
            "min-width: 48px",
            "max-width: 184px",
            "margin-top: 16px",
            "width: 256px",
            "padding: 8px",
            "padding-top: 0",
            "background: var(--r-main-background-color)",
            "transition: transform 200ms linear 0s;",
            "box-shadow: rgba(145, 158, 171, 0.2) 0px 4px 10px;"
        ],
        ".root .left .content": [
            "overflow: auto",
            "width: 95%"
        ],
        ".root .left.hide": [
            "transform: translateX(-100%);",
        ],
        ".root .left .button": [
            "cursor: pointer;",
            "border-radius: 8px;",
            "margin-bottom: 8px",
            "padding: 4px",
            "padding-left: 8px",
            "transition: color 200ms linear 0s;",
        ],
        ".root .left .arrow-background": [
            "position: absolute",
            "background: var(--r-main-background-color)",
            "width: 20px",
            "height: 20px",
            "left: 194px",
            "margin-top: -16px",
            "cursor: pointer"
        ],
        ".root .left .arrow": [
            "width: 100%",
            "height: 100%",
            'background-image: url("data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgc3R5bGU9IndpZHRoOiAxZW07aGVpZ2h0OiAxZW07dmVydGljYWwtYWxpZ246IG1pZGRsZTtmaWxsOiBjdXJyZW50Q29sb3I7b3ZlcmZsb3c6IGhpZGRlbjsiIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBwLWlkPSI3NTUiPjxwYXRoIGQ9Ik0zMjUuMDQ4IDkzLjUxMWwtNjAuMDMwIDU5LjQzNSAzNTcuMTgxIDM1OS42MzEtMzYwLjE4NCAzNTYuNjAzIDU5LjUyMiA1OS45MyA0MjAuMjA3LTQxNi4wNDN6IiBmaWxsPSIjODQ4NDg0IiBwLWlkPSI3NTYiPjwvcGF0aD48L3N2Zz4=");',
        ],
        ".root .container .left.hide .arrow-background .arrow": [
            "transform: rotate(0deg);",
        ],
        ".root .container .left .arrow-background .arrow": [
            "transform: rotate(180deg);",
            "transition: transform 100ms linear 0s;",
        ],
        ".root .left .button:hover": [
            "color: var(--r-ligting-color)"
        ],
        ".root .left .button.selected": [
            "background: var(--r-ligting-color)",
            "box-shadow: rgba(15, 198, 194, 0.2) 0px 10px 25px 0px;",
            "color: white"
        ],
        ".root .left .side": [
            "margin-left: 8px",
        ],
        ".root .left .sidebutton": [
            "padding: 2px",
            "margin-bottom: 8px",
            "cursor: pointer;",
            "color: rgba(0, 0, 0, 0.5);",
            "transition: color 200ms linear 0s;",
        ],
        ".root .left .sidebutton:hover": [
            "color: var(--r-link-color-hover)"
        ],
        ".root .left .sidebutton.selected": [
            "color: black",
            "font-weight: bold",
        ],
        ".root .left .sidebutton:hover .cycle": [
            "background: var(--r-link-color-hover)"
        ],
        ".root .left .sidebutton.selected .cycle": [
            "width: 8px;",
            "height: 8px;",
            "background-color: rgb(15, 198, 194);",
            "margin-right: 6px",
            "margin-left: 2px",
            "border-radius: 50%;"
        ],
        ".root .left .sidebutton .cycle": [
            "width: 4px;",
            "height: 4px;",
            "margin: 4px",
            "margin-right: 8px",
            "background-color: rgba(0, 0, 0, 0.5);",
            "transition: background-color 200ms linear 0s;",
            "border-radius: 50%;"
        ],
        ".root .header": [
            "position: fixed",
            "height: 40px",
            "min-height: 40px",
            "min-width: 100vw",
            "background: var(--r-main-background-color)",
            "z-index: 1",
            "padding: 8px",
            "box-shadow: rgba(145, 158, 171, 0.2) 0px 4px 10px;"
        ],
        ".root .container": [
            "position: relative;",
            "top: 56px;",
        ],
        ".root .container .right": [
            "padding-top: 16px",
            "margin-left: 216px",
            "transition: width 200ms linear 0s;",
            "min-width: calc(100vw - 232px)",
            "min-height: calc(100vh - 72px)",
        ],
        ".root .container .left.hide ~ .right": [
            "margin-left: 0",
            "min-width: 100vw",
        ],
        ".root .container .right .panel": [
            "background-color: rgb(255, 255, 255);",
            "color: rgb(0, 0, 0);",
            "transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;",
            "border-radius: 4px;",
            "background-image: none;",
            "padding: 24px;",
            "box-shadow: rgba(145, 158, 171, 0.2) 0px 4px 10px;",
            "margin: 16px;",
        ],
        ".panel.info-4": [
            "display: flex",
            "flex-warp: warp"
        ],
        ".panel.info-4 div": [
            "width: 25%"
        ],
        ".panel.info-2": [
            "display: flex",
            "flex-warp: warp"
        ],
        ".panel.info-2 div": [
            "width: 50%"
        ],
        ".panel .title": [
            "display: flex",
            "margin: 0px 0px 6px;",
            "font-family: inherit;",
            "font-weight: 400;",
            "line-height: 1.5;",
            "color: rgba(0, 0, 0, 0.5);",
            "font-size: 14px;"
        ],
        ".panel .value": [
            "margin: 0px;",
            "font-family: inherit;",
            "font-weight: 400;",
            "line-height: 1.5;",
            "color: rgba(0, 0, 0, 0.7);",
            "font-size: 24px;",
        ],
        ".root .container .left.hide~.right": [
            "margin-left: 32px",
            "min-width: calc(100vw - 48px)"
        ],
        ".root .left .copyright": [
            "position: fixed;",
            "bottom: 2px",
        ],
        ".qps .icon": [
            "width: 14px",
            "height: 14px"
        ],
        ".qps": [
            "display: flex",
            "align-items: center"
        ],
        ".progress": [
            "position: absolute;",
            "z-index: 2",
            "width: 0",
            "height: 2px",
            "background: var(--r-ligting-color)",
            "transition: width 200ms linear 0s;",
        ],
        "body": [
            "background-color: var(--r-main-background-color)"
        ]
    }
    const root = ttb.createElement("div").class("root")
    const header = ttb.createFlex().class("header").style("align-items", "center")
    const left = ttb.createElement("div").class("left")
    const left_arrow = ttb.createElement("div").class("arrow-background").append(ttb.createElement("div").class("arrow"))
    const left_content = ttb.createElement("div").class("content")
    const left_copyright = ttb.createElement("div").class("copyright")
    const container = ttb.createElement("div").class("right")
    const menu_data = {};  
    const progress = ttb.createElement("div").class("progress")
    const menu_variables = {}

    const set_progress = (val) => {
        progress.setStyle("width", (val * 100.0) + "%")
        if (val * 100.0 >= 99) setTimeout(() => progress.setStyle("width", 0), 250)
    }
    const menu = (key, icon, text, core) => {  
        const hasSubmenu = key.includes('.');  
        if (hasSubmenu) {
            const [mainKey, subKey] = [key.slice(0, key.indexOf(".")), key.slice(key.indexOf(".") + 1)]
            if (!menu_data[mainKey]) menu_data[mainKey] = { icon, children: [], text: '', core };
            if (!("children" in menu_data[mainKey])) menu_data[mainKey].children = [];
            menu_data[mainKey].children.push({ key: subKey, text, core });
        } else menu_data[key] = { key, icon, text, core };
    }
    const display_left = () => {
        left_content.clear()
        //const show = !left.containsClass("hide")
        for (const key in menu_data) {
            const object = menu_data[key]
            const sub = !(!object.children)
            const div = ttb.createFlex().class("button").id("left-list-" + key).append(ttb.createElement("p").setText(object.text)).style("align-items", "center").height("32px").event("click", () => {
                window.location.hash = key + (sub ? "?key=" + object.children[0].key : "")
            })
            left_content.append(div)
            if (sub) {
                const sub_div = ttb.createElement("div").style("display: none").class("side").id("left-list-" + key + "-sub")
                for (const child of object.children) {
                    sub_div.append(ttb.createFlex().class("sidebutton").id("left-list-" + key + "-sub-" + child.key).append(ttb.createElement("div").class("cycle"), ttb.createElement("p").setText(child.text)).style("align-items", "center").height("32px").event("click", () => {
                        window.location.hash = key + (sub ? "?key=" + child.key : "")
                    }))
                }
                left_content.append(sub_div)
            }
        }
    }
    const update_left = () => {
        const key = ttb.getURLKey() || Object.keys(menu_data)[0]
        for (const bkey of Object.keys(menu_data)) {
            if (last_key != key) {
                if (bkey == key) {
                    document.getElementById("left-list-" + bkey).classList.add("selected")
                    last_key_b = ""
                } else document.getElementById("left-list-" + bkey).classList.remove("selected")
            } else if (last_key == bkey) document.getElementById("left-list-" + bkey).classList.add("selected")
            if (document.getElementById("left-list-" + bkey + "-sub")) {
                if (bkey == key) document.getElementById("left-list-" + bkey + "-sub").style.display = "block"
                else document.getElementById("left-list-" + bkey + "-sub").style.display = "none"
                const skey = ttb.getURLKeyParams()['key'] || Object.keys(Object.values(menu_data)[0])[1]
                for (const subkey of menu_data[bkey].children.map(v => v.key)) {
                    if (subkey == skey) {
                        document.getElementById("left-list-" + bkey + "-sub-" + subkey).classList.add("selected")
                        last_key_b = skey
                    } else document.getElementById("left-list-" + bkey + "-sub-" + subkey).classList.remove("selected")
                }
            }
        }
    }
    const popstate = () => {
        const key = ttb.getURLKey() || Object.keys(menu_data)[0]
        const last_key_sub = last_key_b
        update_left()
        if (last_key != key || (last_key_b && last_key_b != last_key_sub)) {
            if (last_key && (last_key_b && last_key_b == last_key_sub))
                handler(last_key, last_key_sub, "disconnect")
            handler(key, last_key_b, "connect")
        }
        last_key = key;
    }
    const handler = (root, key, type) => {
        const object = (key ? menu_data[root].children.filter(v => v.key == key)[0] : menu_data[root]).core || {}
        root += (key ? "-" + key : "")
        if (last_root != root) {
            if (last_root in object && "disconnect" in object) {
                try {
                    object["disconnect"]()
                } catch (e) {
                    console.log(e)
                }
            }
            while (document.getElementsByClassName("right")[0].firstChild != null)
                document.getElementsByClassName("right")[0].removeChild(document.getElementsByClassName("right")[0].firstChild)
            last_root = root
        }
        if (!(type in object)) {
            set_progress(1)
            return
        }
        try {
            document.getElementsByClassName("right")[0].style.display = 'none'
            page = []
            if (type == "connect" && "page" in object) {
                set_progress(0.7)
                if ("init" in object) object["init"]()
                set_progress(0.8)
                page = object["page"]() || []
            }
            set_progress(0.9)
            object[type](page)
            if (page != null)
                document.getElementsByClassName("right")[0].append(ttb.createElement("div").id("module-" + root).append(...(Array.isArray(page) ? page : [page])).valueOf())
            document.getElementsByClassName("right")[0].style.display = 'block'
            set_progress(1)
        } catch (e) {
            console.log(e)
        }
    }
    const root_handler = (func, ...data) => {
        var splited = last_root.split("-", 1)
        var root_ = splited[0], key_ = splited[1];
        const object = (key_ ? menu_data[root_].children.filter(v => v.key == key_)[0] : menu_data[root_]).core || {}
        if (func in object) object[func](...data)
    }
    let last_key = '';
    let last_key_b = '';
    let last_root = '';
    const main_ws = (() => {
        class MainWebSocket {
            constructor() {
                this.websocket = ttb.websocket({
                    "url": "ws" + (window.location.protocol.slice(4)) + "//" + window.location.host + window.location.pathname,
                    "open": () => {
                        this.send("runtime", null)
                        this.send("dashboard", null)
                        this.send("qps")
                        this.send("status")
                    },
                    "message": (msg) => {
                        let reader = new FileReader();
                        reader.onload = () => {
                            let arrayBuffer = reader.result;
                            const input = new DataInputStream(arrayBuffer)
                            this.message(input.readString(), this._deserializeData(input))
                        }
                        reader.readAsArrayBuffer(msg.data)
                    },
                    "close": () => {
                        this.runtime = null
                    }
                })
                this.runtime = null
            }
            
            send(type, data) {
                const buf = new DataOutputStream()
                buf.writeString(type)
                buf.write(this._serializeData(data))
                main_ws.websocket.send(buf)
            }
            message(type, data) {
                root_handler("_ws_message", type, data)
            }
            _deserializeData(input) {
                const type = input.readVarInt()
                switch (type) {
                    case 0: // string
                        return input.readString()
                    case 1: // bool
                        return input.readBoolean()
                    case 2: // float
                        return parseFloat(input.readString())
                    case 3: // bool
                        return parseInt(input.readString())
                    case 4: {// list
                        const length = input.readVarInt()
                        const data = []
                        for (let _ = 0; _ < length; _++) data.push(this._deserializeData(input))
                        return data
                    }
                    case 5: {// table
                        const length = input.readVarInt()
                        const data = {}
                        for (let _ = 0; _ < length; _++) {
                            data[this._deserializeData(input)] = this._deserializeData(input)
                        }
                        return data
                    }
                    case 6:
                        return null
                    default:
                        console.log(type)
                        return null
                }
            }
            _serializeData(data) {
                const buf = new DataOutputStream()
                switch (typeof data) {
                    case "string": {
                        buf.writeVarInt(0)
                        buf.writeString(data)
                        break;
                    }
                    case "boolean": {
                        buf.writeVarInt(1)
                        buf.writeBoolean(data)
                        break;
                    }
                    case "number": {
                        if (Number.isInteger(data)) {
                            buf.writeVarInt(3)
                            buf.writeString(data.toString())
                        }
                        break;
                    }
                    case "object": {
                        if (Array.isArray(data)) {
                            buf.writeVarInt(4)
                            buf.writeVarInt(data.length)
                            for (v of data) {
                                buf.write(this._serializeData(v))
                            }
                        } else if (data != null) {
                            buf.writeVarInt(5);
                            buf.writeVarInt(Object.keys(data).length);
                            for (const key in data) {  
                                buf.write(this._serializeData(key)); 
                                buf.write(this._serializeData(data[key]));
                            }  
                        } else if (data == null) {
                            buf.writeVarInt(6);
                        }
                        break;
                    }
                    case "undefined": {
                        buf.writeVarInt(6); 
                        break;
                    }
                    default:
                        buf.writeVarInt(6); 
                        console.log(data)
                }
                return buf
            }
        }
        return new MainWebSocket()
    })()
    menu('dashboard', '', '数据统计', (() => {
        class Dashboard {
            constructor() {
                this._page = [
                    ttb.createFlex().append(
                        ttb.createElement("div").append(
                            ttb.createElement("div").class("panel").class("info-2").append(
                                ttb.createElement("div").append(
                                    ttb.createElement("p").class("title").setText("运行时间"),
                                    ttb.createElement("p").class("value").setText(this._format_time(this.runtime))
                                ),
                                ttb.createElement("div").append(
                                    ttb.createElement("p").class("title").setText("当前节点状态"),
                                    ttb.createElement("p").class("value").setText("-")
                                )
                            ),
                            ttb.createElement("div").class("panel").class("info-4").append(
                                ttb.createElement("div").append(
                                    ttb.createElement("p").class("title").setText("今日流量"),
                                    ttb.createElement("p").class("value").setText("0"),
                                ),
                                ttb.createElement("div").append(
                                    ttb.createElement("p").class("title").setText("今日下载量"),
                                    ttb.createElement("p").class("value").setText("0"),
                                ),
                                ttb.createElement("div").append(
                                    ttb.createElement("p").class("title").setText("30天流量"),
                                    ttb.createElement("p").class("value").setText("0"),
                                ),
                                ttb.createElement("div").append(
                                    ttb.createElement("p").class("title").setText("30天下载量"),
                                    ttb.createElement("p").class("value").setText("0"),
                                ),
                            )
                        ),
                        ttb.createElement("div").class("panel").append(
                            ttb.createElement("p").class("title").append("QPS", ttb.createElement("div").style("margin-left: 8px; color: rgba(0, 0, 0, 0.7);").setText("0")),
                            ttb.createElement("div").style("height: 84%")
                        ),
                        ttb.createElement("div").class("panel").append(
                            ttb.createElement("p").class("title").setText("每小时访问文件数"),
                            ttb.createElement("div").style("height: 128px")
                        ),
                        ttb.createElement("div").class("panel").append(
                            ttb.createElement("p").class("title").setText("每小时访问文件大小"),
                            ttb.createElement("div").style("height: 128px")
                        ),
                        ttb.createElement("div").class("panel").append(
                            ttb.createElement("p").class("title").setText("每天访问文件数"),
                            ttb.createElement("div").style("height: 128px")
                        ),
                        ttb.createElement("div").class("panel").append(
                            ttb.createElement("p").class("title").setText("每天访问文件大小"),
                            ttb.createElement("div").style("height: 128px")
                        )
                    ).minWidth("324px").child(2).minWidth(512)
                ]
                this._page[0].event('resize', () => {
                    this._e_hits.resize()
                    this._e_bytes.resize()
                    this._e_daily_hits.resize()
                    this._e_daily_bytes.resize()
                    this._e_qps.resize()
                })
                this.runtime = null
                this._hourly = Array.from({length: 24}, (_, i) => i + " 时")
                this._runtimeTimer = setInterval(() => this.updateRuntime(), 1000)
                this._dashboardTimer = setInterval(() => {
                    main_ws.send("dashboard", null)
                }, 10000)
                setTimeout(() => {
                    this._qpsTimer = setInterval(() => {
                        main_ws.send("qps")
                    }, 5000)
                }, 5 - ttb.getTime() % 5)
                this._e_options = {  
                    tooltip: {  
                        trigger: 'axis'  
                    },  
                    grid: {  
                        left: '3%',  
                        right: '4%',  
                        bottom: '3%',
                        top: '20%',
                        containLabel: true  
                    },  
                    xAxis: {  
                        type: 'category',
                    },  
                    yAxis: {  
                        type: 'value',
                        min: 1,
                        max: 10
                    },  
                    series: []  
                };  
                this._unit_bytes = ["B", "KB", "MB", "GB", "TB", "PB", "EB"]
                this._unit_number = ["", "k", "M", "G", "T", "P", "E"]
                this._e_hits        = echarts.init(this._page[0].getChildrens()[2].getChildrens()[1].valueOf())
                this._e_bytes       = echarts.init(this._page[0].getChildrens()[3].getChildrens()[1].valueOf())
                this._e_daily_hits  = echarts.init(this._page[0].getChildrens()[4].getChildrens()[1].valueOf())
                this._e_daily_bytes = echarts.init(this._page[0].getChildrens()[5].getChildrens()[1].valueOf())
                this._e_qps         = echarts.init(this._page[0].getChildrens()[1].getChildrens()[1].valueOf())
                this._e_hits.setOption(this._e_options)
                this._e_bytes.setOption(this._e_options)
                this._e_hits.setOption({
                    xAxis: {  
                        data: this._hourly,
                    }, 
                })
                this._e_bytes.setOption({
                    xAxis: {  
                        data: this._hourly,
                    }, 
                })
                this._e_daily_hits.setOption(this._e_options)
                this._e_daily_bytes.setOption(this._e_options)
                this._e_qps.setOption({
                    color: "#0fc6c2",
                    tooltip: {
                        trigger: 'axis',
                        formatter: e => '<div style="margin: 0px 0 0;line-height:1;"><div style="margin: 0px 0 0;line-height:1;"><div style="font-size:14px;color:#666;font-weight:400;line-height:1;">' + e[0].name + '</div><div style="margin: 10px 0 0;line-height:1;"><div style="margin: 0px 0 0;line-height:1;"><div style="margin: 0px 0 0;line-height:1;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#0fc6c2;"></span><span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">QPS</span><span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">Avg: ' + e[0].data.value + " total: " + ttb.sum(...e[0].data.raw) + '</span><div style="clear:both"></div></div><div style="clear:both"></div></div><div style="clear:both"></div></div><div style="clear:both"></div></div><div style="clear:both"></div></div>',
                    },
                    stateAnimation: {
                        duration: 300,
                        easing: "cubicOut"
                    },
                    xAxis: {
                        type: "category",
                        show: false,
                    },
                    yAxis: {
                        show: false,
                        type: "value",
                    },
                    grid: {
                        top: 10,
                        bottom: 10,
                        right: 0,
                        left: 0,
                        show: !1,
                        z: 0,
                        containLabel: !1,
                        backgroundColor: "rgba(0,0,0,0)",
                        borderWidth: 1,
                        borderColor: "#ccc"
                    },
                    series: [
                        {
                            type: "bar",
                            barGap: "0",
                            barMinHeight: 4,
                            itemStyle: {
                                borderRadius: [2, 2, 0, 0]
                            },
                            z: 2,
                            backgroundStyle: {
                                color: "rgba(180, 180, 180, 0.2)",
                                borderColor: null,
                                borderWidth: 0,
                                borderType: "solid",
                                borderRadius: 0,
                                shadowBlur: 0,
                                shadowColor: null,
                                shadowOffsetX: 0,
                                shadowOffsetY: 0
                            },
                            select: {
                                itemStyle: {
                                    borderColor: "#212121"
                                }
                            },
                        }
                    ]
                })
                this._e_set_days()
                setTimeout(() => {
                    this._page[0].update()
                }, 100)
            }
            updateRuntime() {
                this._page[0].getChildrens()[0].getChildrens()[0].getChildrens()[0].getChildrens()[1].setText(this._format_time(this.runtime, true))
            }
            updateStatus(text) {
                this._page[0].getChildrens()[0].getChildrens()[0].getChildrens()[1].getChildrens()[1].setText(text)
            }
            _e_format_time(n) {
                const date = new Date(n)
                return date.getHours().toString().padStart(2, 0) + ":" + date.getMinutes().toString().padStart(2, 0) + ":" + date.getSeconds().toString().padStart(2, 0)
            }
            _e_set_days() {
                let day = Number.parseInt(ttb.getTime() / 86400) - 30;
                let days = Array.from({length: 31}, (_, i) => this._format_date((day + i + 1) * 86400000))
                this._e_daily_hits.setOption({
                    xAxis: {  
                        data: days,
                    }, 
                })
                this._e_daily_bytes.setOption({
                    xAxis: {  
                        data: days,
                    }, 
                })
            }
            disconnect() {
                clearInterval(this._runtimeTimer)
                clearInterval(this._qpsTimer)
            }
            connect(page) {
                page.push(...this._page)
            }
            _ws_message(type, data) {
                if (type == "runtime") {
                    this.runtime = data
                    this.updateRuntime()
                }
                if (type == "dashboard") {
                    {
                        const hourly_data = data.hourly
                        let min = Math.max(...hourly_data.map(v => v._hour))
                        let hits = 0
                        let bytes = 0
                        {
                            const io = Array.from({ length: min }, (_, __) => 0);
                            const cache = Array.from({ length: min }, (_, __) => 0);
                            for (const val of hourly_data) {
                                io[val._hour] = val.hits
                                cache[val._hour] = val.cache_hits
                                min = Math.max(min, val._hour)
                            }
                            this._e_hits.setOption({
                                legend: {
                                    data: ["I/O访问数", "缓存访问数"]
                                },
                                yAxis: {
                                    max: Math.max(10, ...io, ...cache),
                                },
                                series: [{
                                    name: "I/O访问数",
                                    data: io,
                                    type: 'line',
                                    smooth: true
                                }, {
                                    name: "缓存访问数",
                                    data: cache,
                                    type: 'line',
                                    smooth: true
                                }]
                            })
                            hits = ttb.sum(...io, ...cache)
                        }
                        {
                            const io = Array.from({ length: min }, (_, __) => 0);
                            const cache = Array.from({ length: min }, (_, __) => 0);
                            for (const val of hourly_data) {
                                io[val._hour] = val.bytes
                                cache[val._hour] = val.cache_bytes
                            }
                            this._e_bytes.setOption({
                                tooltip: {
                                    formatter: (params) => {
                                        return `<div style="margin: 0px 0 0;line-height:1;"><div style="margin: 0px 0 0;line-height:1;"><div style="font-size:14px;color:#666;font-weight:400;line-height:1;">${params[0].name}</div><div style="margin: 10px 0 0;line-height:1;"><div style="margin: 0px 0 0;line-height:1;"><div style="margin: 0px 0 0;line-height:1;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#5470c6;"></span><span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">${params[0].seriesName}</span><span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">${this._format_bytes(params[0].value)}</span><div style="clear:both"></div></div><div style="clear:both"></div></div><div style="margin: 10px 0 0;line-height:1;"><div style="margin: 0px 0 0;line-height:1;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#91cc75;"></span><span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">${params[1].seriesName}</span><span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">${this._format_bytes(params[1].value)}</span><div style="clear:both"></div></div><div style="clear:both"></div></div><div style="clear:both"></div></div><div style="clear:both"></div></div><div style="clear:both"></div></div>`
                                    }
                                },
                                legend: {
                                    data: ["I/O访问文件大小", "缓存访问文件大小"]
                                },
                                yAxis: {
                                    max: Math.max(10, ...io, ...cache),
                                    axisLabel: {
                                        formatter: (value) => {
                                            return this._format_bytes(value)
                                        }
                                    }
                                },
                                series: [{
                                    name: "I/O访问文件大小",
                                    data: io,
                                    type: 'line',  
                                    smooth: true
                                }, {
                                    name: "缓存访问文件大小",
                                    data: cache,
                                    type: 'line',  
                                    smooth: true
                                }]
                            })
                            bytes = ttb.sum(...io, ...cache)
                        }
                        this._page[0].getChildrens()[0].getChildrens()[1].getChildrens()[0].getChildrens()[1].setText(this._format_number_unit(hits))
                        this._page[0].getChildrens()[0].getChildrens()[1].getChildrens()[1].getChildrens()[1].setText(this._format_bytes(bytes))
                    }
                    {
                        const daily_data = data.days;
                        let hits = 0
                        let bytes = 0
                        {
                            const io = Array.from({ length: 30 }, (_, __) => 0);
                            const cache = Array.from({ length: 30 }, (_, __) => 0);
                            for (const val of daily_data) {
                                io[val._day] = val.hits
                                cache[val._day] = val.cache_hits
                            }
                            this._e_daily_hits.setOption({
                                legend: {
                                    data: ["I/O访问数", "缓存访问数"]
                                },
                                yAxis: {
                                    max: Math.max(10, ...io, ...cache),
                                },
                                series: [{
                                    name: "I/O访问数",
                                    data: io,
                                    type: 'line',  
                                    smooth: true
                                }, {
                                    name: "缓存访问数",
                                    data: cache,
                                    type: 'line',  
                                    smooth: true
                                }]
                            })
                            hits = ttb.sum(...io, ...cache)
                        }
                        {
                            const io = Array.from({ length: 30 }, (_, __) => 0);
                            const cache = Array.from({ length: 30 }, (_, __) => 0);
                            for (const val of daily_data) {
                                io[val._day] = val.bytes
                                cache[val._day] = val.cache_bytes
                            }
                            this._e_daily_bytes.setOption({
                                tooltip: {
                                    formatter: (params) => {
                                        return `<div style="margin: 0px 0 0;line-height:1;">
                                            <div style="margin: 0px 0 0;line-height:1;">
                                                <div style="font-size:14px;color:#666;font-weight:400;line-height:1;">${params[0].name}</div>
                                                <div style="margin: 10px 0 0;line-height:1;">
                                                    <div style="margin: 0px 0 0;line-height:1;">
                                                        <div style="margin: 0px 0 0;line-height:1;">
                                                            <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#5470c6;"></span>
                                                            <span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">${params[0].seriesName}</span>
                                                            <span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">${this._format_bytes(params[0].value)}</span>
                                                            <div style="clear:both"></div>
                                                        </div><div style="clear:both"></div>
                                                    </div>
                                                <div style="margin: 10px 0 0;line-height:1;">
                                                    <div style="margin: 0px 0 0;line-height:1;">
                                                        <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#91cc75;"></span>
                                                        <span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">${params[1].seriesName}</span>
                                                        <span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">${this._format_bytes(params[1].value)}</span>
                                                        <div style="clear:both"></div>
                                                    </div>
                                                    <div style="clear:both"></div>
                                                </div>
                                                <div style="clear:both"></div>
                                            </div>
                                            <div style="clear:both"></div>
                                            </div><div style="clear:both"></div>
                                        </div>`
                                    }
                                },
                                legend: {
                                    data: ["I/O访问文件大小", "缓存访问文件大小"]
                                },
                                yAxis: {
                                    max: Math.max(10, ...io, ...cache),
                                    axisLabel: {
                                        formatter: (value) => {
                                            return this._format_bytes(value)
                                        }
                                    }
                                },
                                series: [{
                                    name: "I/O访问文件大小",
                                    data: io,
                                    type: 'line',  
                                    smooth: true
                                }, {
                                    name: "缓存访问文件大小",
                                    data: cache,
                                    type: 'line',  
                                    smooth: true
                                }]
                            })
                            bytes = ttb.sum(...io, ...cache)
                        }
                        this._page[0].getChildrens()[0].getChildrens()[1].getChildrens()[2].getChildrens()[1].setText(this._format_number_unit(hits))
                        this._page[0].getChildrens()[0].getChildrens()[1].getChildrens()[3].getChildrens()[1].setText(this._format_bytes(bytes))
                    }
                }
                if (type == "qps") {
                    const time = parseInt(ttb.getTimestamp() / 1000)
                    const ntime = (time % 5 != 0 ? 5 : 0) - (time % 5) + time
                    const ltime = ntime - 300;
                    const qps = []
                    var sums = [];
                    var date = []
                    for (let i = ltime; i <= ntime; i++) {
                        let value = (!data.hasOwnProperty(i) ? 0 : data[i]);
                        sums.push(value);
                        if (i % 5 == 0) {
                            qps.push({value: ttb.sum(...sums) / sums.length, raw: sums});
                            sums = []
                            date.push(this._e_format_time(i * 1000))
                        }
                    }
                    this._page[0].valueOf().children[1].children[0].children[0].innerText = ttb.sum(...qps[qps.length - 1].raw)
                    this._e_qps.setOption({
                        xAxis: {
                            data: date
                        },
                        series: [{data: qps}]
                    })

                }
                if (type == "status") {
                    this.updateStatus(data)
                }
            }
            _format_number(n, i = null) {
                if (n == 0) return `${n}${this._unit_number[0]}`
                i = i || Math.min(Number.parseInt(Math.floor(Math.log(n) / Math.log(1000))), this._unit_number.length)
                if (i <= 0) return `${n}${this._unit_number[0]}` 
                n = n / (1024 ** i)
                return `${n.toFixed(1)}${this._unit_number[i]}`
            }
            _format_number_unit(n) {
                var d = (n + "").split("."), i = d[0], f = d.length >= 2 ? "." + d.slice(1).join(".") : ""
                return i.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ") + f;
            }
            _format_date(n) {
                const date = new Date(n)
                return `${date.getFullYear().toString().padStart(4, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
            }
            _format_time(n, sub = false) {
                if (n == null) return "-"
                let seconds = Number.parseInt(n)
                if (sub) seconds = Number.parseInt(ttb.getTime() - seconds)
                return `${parseInt(seconds / 60 / 60 / 24).toString().padStart(2, '0')} 天 ${parseInt(seconds / 60 / 60 % 24).toString().padStart(2, '0')} 小时 ${parseInt(seconds / 60 % 60).toString().padStart(2, '0')} 分钟 ${parseInt(seconds % 60).toString().padStart(2, '0')} 秒`
            }
            _format_bytes(size, i = null) {
                if (size == 0) return `${size.toFixed(2)}${this._unit_bytes[0]}`
                i = i || Math.min(Number.parseInt(Math.floor(Math.log(size) / Math.log(1024))), this._unit_bytes.length)
                if (i <= 0) return `${size.toFixed(2)}${this._unit_bytes[0]}` 
                size = size / (1024 ** i)
                return `${size.toFixed(2)}${this._unit_bytes[i]}`
            }
        }
        return new Dashboard()
    })());  
    const resize = () => {
        display_left()
        update_left()
    }

    header.append(ttb.createElement("h3").setText("Python OpenBMCLAPI Dashboard"))
    left_copyright.append(
        ttb.createElement("p").append(ttb.createElement("a").setAttribute("href", "mailto:administrator@ttb-network.top").setText("TTB Network"), " - ", ttb.VERSION)
    )
    left_arrow.event("click", () => {
        left.toggle("hide")
        window.dispatchEvent(new Event('resize'));
    })
    root.append(header, ttb.createElement("div").class("container").append(left.append(left_arrow, left_content, left_copyright), container))
    window.addEventListener("resize", resize)
    window.addEventListener("popstate", popstate)
    document.body.prepend(progress.valueOf(), root.valueOf())
    display_left()
    ttb.set_styles(global_styles)
    popstate()
    resize()
})()
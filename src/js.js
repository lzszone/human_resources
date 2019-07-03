HtmlStatistics (HtmlType, DataType, data) {
    try {
        let uid = Root.getUser().id;
        let htmlContent = localStorage.getItem(uid + '_html') ? JSON.parse(localStorage.getItem(uid + '_html')) : null;
        let oldTime = htmlContent ? htmlContent.time : null;
        let chatArr = ['Group_Chat_Html', 'User_Chat_Html', 'Chat_List_Html', 'Main_Html'];
        let save = (obj, date) => {
            date ? obj['time'] = date : null;
            localStorage.setItem(uid + '_html', JSON.stringify(obj));
        };
        if (DataType === 'exit' || (htmlContent && htmlContent[HtmlType])) {
            if (HtmlType){
                let obj = htmlContent[HtmlType];
                let newObj = {};
                let val = typeof obj.count === 'string' ? parseInt(obj.count) : obj.count;
                newObj['count'] = DataType === 'start' ? val + 1 : val;
                newObj['sTime'] = DataType === 'start' ? data : obj.sTime;
                newObj['eTime'] = DataType === 'end' ? data : obj.eTime;
                newObj['timing'] = DataType === 'end' ? obj.timing + (data - obj.sTime) : obj.timing;
                let arr = obj.jumpContent;
                if (DataType === 'jump'){
                    let tf = false;
                    // 判断数据是否已经存在，如存在累加count 如不存在新建一条数据
                    for (let i=0; i<arr.length; i++){
                        let str = arr[i];
                        if (str.split(',')[0] === data){
                            tf = true;
                            let count = typeof str.split(',')[2] === 'string' ? parseInt(str.split(',')[2]) : str.split(',')[2];
                            let now = 0;
                            let chatKey = chatArr.indexOf(str.split(',')[0]) > -1 ? 'Chat_Html' : str.split(',')[0];
                            if (htmlContent && htmlContent[chatKey]){
                                now = Date.now() - htmlContent[chatKey].sTime;
                            }
                            arr[i] = `${str.split(',')[0]},${str.split(',')[1]},${count+now}`;
                        }
                    }
                    if (!tf){
                        let now = 0;
                        let chatKey = chatArr.indexOf(data) > -1 ? 'Chat_Html' : data;
                        if (htmlContent && htmlContent[chatKey]){
                            now = Date.now() - htmlContent[chatKey].sTime;
                        }
                        arr.push(`${data},${this.formatEventData(data, 'htmlData')},${now}`);
                    }
                }
                newObj['jumpContent'] = arr;
                htmlContent[HtmlType] = newObj;
            }
            // 时间超过15Min  发出请求
            if (DataType === 'exit' || (oldTime && Date.now() - oldTime > 900000)){
                HtmlType ? save(htmlContent, Date.now()) : null;
                // 组装页面进入次数数据
                let paramCount = {};
                let paramTime = {};
                let paramAnalysisContent = {};
                let paramAnalysisKeys = [];
                Object.keys(htmlContent).forEach((val) => {
                    if (val !== 'time'){
                        let item = htmlContent[val];
                        let countKey = this.formatEventData(val, 'countData');
                        if(countKey !== undefined && countKey !== null && item.count){
                            paramCount[countKey] = item.count;
                        }
                        let timeKey = this.formatEventData(val, 'timeData');
                        if(timeKey !== undefined && timeKey !== null && item.timing){
                            paramTime[timeKey] = item.timing;
                        }
                        if(item && item.jumpContent.length > 0){
                            let str = `${this.formatEventData(val, 'htmlData')},${val}`;
                            paramAnalysisContent[str] = item.jumpContent;
                            paramAnalysisKeys.push(str);
                        }
                    }
                });
                // 请求 /usage/count
                if(Object.keys(paramCount).length > 0){
                    this.StatisticsSend(Action.UsageCount, paramCount, '', () => {});
                }
                // 请求 /usage/time
                if(Object.keys(paramTime).length > 0){
                    this.StatisticsSend(Action.UsageTime, paramTime, '', () => {});
                }
                // 请求 /page/analysis
                if(paramAnalysisKeys.length > 0){
                    this.StatisticsSend(Action.Analysis, paramAnalysisContent, '', () => {
                        this.clearStatisticsData('html');
                    }, paramAnalysisKeys);
                }
            } else {
                save(htmlContent);
            }
        } else {
            if (DataType !== 'end'){
                let obj = {};
                let saveTF = false;
                obj['count'] = DataType === 'jump' ? 0 : 1;
                obj['sTime'] = DataType === 'start' ? data : Date.now();
                obj['eTime'] = DataType === 'end' ? data : Date.now();
                obj['timing'] = 0;
                let arr = [];
                if (DataType === 'jump'){
                    let now = 0;
                    let chatKey = chatArr.indexOf(data) > -1 ? 'Chat_Html' : data;
                    if (htmlContent && htmlContent[chatKey]){
                        now = Date.now() - htmlContent[chatKey].sTime;
                    } else if ((!htmlContent && chatKey === 'Chat_Html') || (!htmlContent[chatKey] && chatArr.indexOf(data) > -1)){
                        saveTF = true;
                        let objChat = {};
                        objChat['count'] = 1;
                        objChat['sTime'] = Date.now();
                        objChat['eTime'] = Date.now();
                        objChat['timing'] = 0;
                        objChat['jumpContent'] = [];
                        let pChat = {};
                        pChat['Chat_Html'] = objChat;
                        save(pChat, Date.now());
                    }
                    arr.push(`${data},${this.formatEventData(data, 'htmlData')},${now}`);
                }
                obj['jumpContent'] = arr;
                let p = htmlContent && !htmlContent[HtmlType] ? htmlContent : {};
                if (saveTF){
                    p = localStorage.getItem(uid + '_html') ? JSON.parse(localStorage.getItem(uid + '_html')) : null;
                }
                p[HtmlType] = obj;
                let d = htmlContent ? null : Date.now();
                save(p, d);
            }
        }
    } catch (e) {
        console.log('HtmlStatistics', e);
    }
},

/**
 * P_C - 事件统计
 * @param eventType 事件类型
 * @param sendType 单独字段'exit' 退出应用时触发
 * @constructor
 */
EventStatistics (eventType, sendType) {
    try {
        if(eventType || sendType === 'exit'){
            let uid = Root.getUser().id;
            let eventCount = localStorage.getItem(uid + '_event') ? JSON.parse(localStorage.getItem(uid + '_event')) : null;
            let oldTime = eventCount ? eventCount.time : null;
            let save = (obj, date) => {
                date ? obj['time'] = date : null;
                localStorage.setItem(uid + '_event', JSON.stringify(obj));
            };
            if (eventCount || sendType === 'exit'){
                let newTime = Date.now();
                if (sendType !== 'exit'){
                    let val = typeof eventCount[eventType] === 'string' ? parseInt(eventCount[eventType]) : eventCount[eventType];
                    val ? eventCount[eventType] = val+1 : eventCount[eventType] = 1;
                }
                if(sendType === 'exit' || (oldTime && newTime - oldTime > 900000)){
                    // // 发送事件次数
                    // this.StatisticsSend(Action.UsageCount, eventCount, () => {
                    // 发送事件
                    let countData = {};
                    // let countKeyArr = Object.keys(eventCount);
                    // for(let i=0;i<countKeyArr.length;i++){
                    //     if (countKeyArr[i] !== 'time'){
                    //         let key = this.formatEventData(countKeyArr[i], 'eventData');
                    //         countData[key] = countKeyArr[i];
                    //     }
                    // }
                    Object.keys(eventCount).forEach((val) => {
                        if (val !== 'time'){
                            let key = this.formatEventData(val, 'eventData');
                            countData[key] = val;
                        }
                    });
                    if (Object.keys(countData).length > 0){
                        this.StatisticsSend(Action.SpapEvent, countData, 'event', () => {
                            save({}, Date.now());
                        });
                    }
                    // });
                } else {
                    save(eventCount);
                }
            } else {
                let obj = {};
                obj[eventType] = 1;
                save(obj, Date.now());
            }
        }
    } catch (e) {
        console.log('EventStatistics', e);
    }
},
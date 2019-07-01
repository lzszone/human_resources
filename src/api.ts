import axios, { AxiosResponse } from 'axios';

const ins = axios.create({
    baseURL: 'http://localhost:9000/',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
});

function setHeaders(obj: any) {
    Object.assign(ins.defaults.headers, obj)
}

interface ListData<T> {
    pageNum: number, // 当前页
    pageSize: number, // 每页的数量
    size: number, // 当前页的数量
    total: number, // 总记录数
    pages: number, // 总页数
    list: Array<T>, // 结果数据，API接口返回数据描述中的接口为此字段中object的结构
    prePage: number, // 前一页
    nextPage: number, // 后一页
    isFirstPage: boolean, // 是否为第一页
    isLastPage: boolean, // 是否为最后一页
    hasPreviousPage: boolean, // 是否有前一页
    hasNextPage: boolean, // 是否有下一页
    navigatePages: number, // 导航页码数
    navigatepageNums: Array<number>, // 所有导航页号
    navigateFirstPage: number, // 导航条上的第一页
    navigateLastPage: number // 导航条上的最后一页
}

interface CustomResponse<T> {
    code: number,
    message: string,
    data: T
};

class CustomError extends Error {
    public code: number;
    public message: string;
    constructor(code: number, message: string) {
        super();
        this.code = code;
        this.message = message;
    }
}

ins.interceptors.response.use(function(response: AxiosResponse<CustomResponse<any>>) {
    console.log(response.data)
    const {data: {code, message, data}} = response;
    if(code !== 1000) {
        const error = new CustomError(code, message);
        console.error(error)
        return Promise.reject(error)
    }
    return data;
}, function (error) {
    console.error(error)
    return Promise.reject(error);
});

enum LoginType {
    message = 1,
    password = 2,
    wechat = 3
}

interface LoginInterface {
    loginType: LoginType,
    mobile: string
}

interface MessageLogin extends LoginInterface {
    loginType: LoginType.message,
    code: string,
    requestId: string
}

interface PasswordLogin {
    loginType: LoginType.password,
    password: string,
}

interface WechatLogin {
    loginType: LoginType.wechat
}

type LoginParam = MessageLogin | PasswordLogin | WechatLogin;

interface SubmitProfileParam {
    realName: string,//	真实姓名
    sex:1 | 2,//	性别：1男， 2 女
    birthDate: string,//	Y	出生日期，按照: yyyy-MM-dd格式
    nationId: number, //	Y	民族ID，参照字典表读取,dictName为: nation
    nativePlace: string	//Y	籍贯
    educationId: number,//	Y	学历ID，参照字典表读取, dictName为: education
    skills:	Array<string>, //	Y	个人技能列表，数组类型，string传入
    photos:	Array<string>,//	Y	照片列表，数组类型，string传入
    perilName: string,	//Y	紧急联系人姓名
    perilPhone:	string,//	Y	紧急联系人电话
    perilRelaId: number//	Y	紧急联系人关系ID，参照字典表读取，dictName为：perilRela
}

interface CustomerProfile extends SubmitProfileParam {
    mobile: string,
    nation: string,
    education: string,
    perilRela: string
}

interface PageParam {
    pageNum: number, 
    pageSize: number
}

interface RecruitParam {
    searchText?:	string,//	N	搜索内容
    areaId?:	number,//	N	地区ID
    areaType?: number,//	N	地区类型(1:省, 2:市, 3:区)
    recruitLabelItemIds?: Array<number>//	N	招聘标签ID数组，查看获取搜索参数信息接口
}

const api = {
    customer: {
        sendAuthorizationCode(mobile: string, ticket: string, randomStr: string): Promise<string> {
            return ins.post('/api/customer/sendAuthorizationCode', {mobile, ticket, randomStr})
        },
        login(param: LoginParam): Promise<{
            token: string,//	鉴权Token，需要鉴权的业务需要带上该Token识别身份
            tokenExpireTime: string,//	Token过期时间戳
            loginType: LoginType,// 登录方式(1: 手机号码登录, 2: 微信登陆)
            customerName: string,//	登陆用户名
            customerAvatar: string,//	用户头像
            customerNick: string,//	用户昵称
            hasProfile: boolean,//	是否填写个人信息
            hasBindMobile: boolean,// 是否绑定手机
        }> {
            return ins.post('/api/customer/login', param)
        },
        bindDealer(mobile: string, code: string, requestId: string, dealerId: number): Promise<void> {
            return ins.post('/api/customer/bindDealer', {mobile, code, requestId, dealerId})
        },
        submitProfile(p: SubmitProfileParam): Promise<void> {
            return ins.post('/api/customer/submitProfile', p)
        },
        getProfile(): Promise<CustomerProfile> {
            return ins.post('/api/customer/getProfile')
        },
        setLoginPass(code: string, requestId: string, newPass: string): Promise<void> {
            return ins.post('/api/customer/setLoginPass', {code, requestId, newPass})
        },
        message: {
            list(p: PageParam): Promise<ListData<{
                id: number,	//消息ID
                title: string, //	消息标题
                content: string,//	消息内容
                read: boolean, //	是否已读
                createTime: string//	创建时间(yyyy-MM-dd)
            }>> {
                return ins.post('/api/customer/message/list', p)
            },
            markAsRead(id: number): Promise<void> {
                return ins.post('/api/customer/message/read', {id})
            },
            markAllAsRead(): Promise<void> {
                return ins.post('/api/customer/message/allRead')
            }
        }
    },
    complaint: {
        submit(type: number, complaintTypeId: number, content: string, evidences: Array<string>): Promise<void> {
            return ins.post('/api/complaint/submit', {type, complaintTypeId, content, evidences})
        },
        list(p: PageParam): Promise<ListData<{
            id: number, //	反馈ID
            type: number,//	反馈类型(1: 意见反馈, 2: 投诉)
            complaintType: string, //	投诉类型
            content: string, //	反馈内容
            status:	number,//	状态(0: 未处理, 1: 已处理)
            createTime:	string, //	创建时间(yyyy-MM-dd HH:mm:ss)
            result:	string, //	处理结果
            evidences: Array<string>//	截图列表
        }>> {
            return ins.post('/api/complaint/list', p)
        }
    },
    common: {
        getDictData(dictName: string): Promise<{
            id:	number,//	字典数据ID
            dictName: string,//	字典名称
            dataKey: string,//	字典数据名称
            dataValue: string, //	字典数据值
        }> {
            return ins.post('/api/common/getDictData', {dictName})
        },
        uploadImage(file: File, serviceId: number): Promise<{
            fileSuffix:	string,//	文件后缀
            savePath: string,//	存储路径，任何提供图片地址的接口需要传入该地址
            previewPath: string,//	预览地址，请不要将该地址传入任何需要传入图片地址的接口
            fileMd5: string,//	文件MD5值
        }> {
            return ins.post('/api/common/uploadImage', {file, serviceId})
        }
    },
    recruit: {
        list(p: RecruitParam): Promise<ListData<{
            id: number,//	招聘信息ID
            title: string,//	招聘标题
            minSalary: number,//	最低招聘工资
            maxSalary: number,//	最高招聘工资
            companyAddress:	string,//	公司地址
            estimateNumber:	number,//	预计招聘人数
            recruitNumber: number,//	已报名人数
            recruitLabels: Array<string>//	招聘标签列表，数组类型
        }>> {
            return ins.post('/api/recruit/list', p)
        },
        getSearchParams(): Promise<Array<{
            id: number,
            labelName: string,
            detailList: Array<{
                id: number,
                itemName: string
            }>
        }>> {
            return ins.post('/api/recruit/getSearchParams')
        },
        detail(id: number): Promise<{
            id:	number,//	招聘信息ID
            title: string,//	招聘标题
            minSalary: number,//	最低招聘工资
            maxSalary: number,//	最高招聘工资
            companyName: string,//	公司名称
            companyAddress: string,//	公司地址
            arrivalTime: string,//	到岗时间(yyyy-MM-dd)
            companyJobName: string,//	岗位名称
            estimateNumber: number,//	预计招聘人数
            recruitNumber: number,//	已报名人数
            recruitLabels: Array<string>,//	招聘标签列表，数组类型
            recruitContent: string, //	招聘详情内容
            bannerList: Array<{ //	Banner列表
                id: number,	//Banner ID
                path: string,//	Banner地址
                sort: number//	Banner排序
            }>,
            labelModuleList: Array<{//	标签模块列表
                id: number,	//Banner ID
                labelName: string,//	Banner地址
                sort: number,//	Banner排序
                itemList: Array<{//标签item列表
                    id: number,//	itemId
                    itemName: string,//	标签item名称
                    itemValue: string//	标签item值
                }>
            }>
        }> {
            return ins.post('/api/recruit/detail', {id})
        },
        signup(recruitId: number): Promise<void> {
            return ins.post('/api/recruit/signup', {recruitId})
        }
    },
    posts() {
        return ins.get('/api/v1/employees')
    }
};

export default api;

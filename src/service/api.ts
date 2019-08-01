import axios, {AxiosResponse, AxiosRequestConfig, CancelTokenSource} from 'axios';
import qs from 'qs';
import { number } from 'prop-types';

const ins = axios.create({
    // baseURL: 'http://127.0.0.1:3000/',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
});

function setHeaders(obj: any) {
    Object.assign(ins.defaults.headers, obj)
}
function axiosPost(url: string, postBody: any = {}, options: AxiosRequestConfig = {}) {
    const source = axios.CancelToken.source();
    options.cancelToken = source.token;
    const promise = ins.post(url, postBody, options);
    return {source, promise}
}

ins.interceptors.response.use(function(response: AxiosResponse<CustomResponse<any>>) {
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

ins.interceptors.request.use(function(req) {
    req.data = qs.stringify(req.data);
    return req
});

export interface ApiResult<T> {
    source: CancelTokenSource,
    promise: Promise<AxiosResponse<T>>
};

export enum JobSignupHistoryStatusEnum {
    all = 0,
    processing = 1,
    passed = 2,
    rejected = 3    
};

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
};

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
};

enum LoginType {
    message = 1,
    password = 2,
    wechat = 3
};

interface LoginInterface {
    loginType: LoginType,
    mobile: string
};

interface MessageLogin extends LoginInterface {
    loginType: LoginType.message,
    code: string,
    requestId: string
};

interface PasswordLogin {
    loginType: LoginType.password,
    password: string,
};

interface WechatLogin {
    loginType: LoginType.wechat
};

export type LoginParam = MessageLogin | PasswordLogin | WechatLogin;

export interface SubmitProfileParam {
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
};

export interface CustomerProfile extends SubmitProfileParam {
    mobile: string,
    nation: string,
    education: string,
    perilRela: string
};

export interface PageParam {
    pageNum: number, 
    pageSize: number
};

export interface RecruitParam {
    searchText?:	string,//	N	搜索内容
    areaId?:	number,//	N	地区ID
    areaType?: number,//	N	地区类型(1:省, 2:市, 3:区)
    recruitLabelItemIds?: Array<number>//	N	招聘标签ID数组，查看获取搜索参数信息接口
};

export interface JobSignupHistory {
    id: number, //	报名记录ID
    recruitId: number, //	招聘记录ID
    recruitTitle: string, //	招聘标题
    status: number,	// 报名状态(1: 审核中, 2: 未通过, 3: 已通过)
    rejectContent: string, //	驳回理由
    createTime: string // 创建时间(yyyy-MM-dd HH:mm:ss)
};

export interface WXLoginResult {
    token: string, //	鉴权Token
    tokenExpireTime: number, //	Token过期时间戳
    loginType: number, //	登陆方式(1: 手机号码登录, 2: 微信登陆, 3: 微信公众号登陆)
    customerName: string, //	登陆用户名
    customerAvatar:	string, //	用户头像
    customerNick: string, //	用户昵称
    hasProfile: boolean, //	是否填写个人信息
    hasBindMobile: boolean//	是否绑定手机
};

export interface CustomerInfo {
    customerName: string, //	用户名
    customerAvatar: string, //	用户头像
    customerNick: string, //	用户昵称
    hasProfile: boolean, //	是否填写个人信息
    hasBindMobile: boolean, //	是否绑定手机
    hasPassword: boolean, //	是否有密码
};

export interface StationUser {
    id: number, //	驻场ID
    realName: string, //	驻场真实姓名
    mobile: string, //	驻场手机号
    description: string, //	驻场描述
    avatar: string, //	驻场头像
};

export interface WageCardInfo {
    bankName: string, //	开户行名称
    bankCard:string, //	银行卡号
    cardholder: string,//	持卡人姓名
};

enum BorrowStatus {
    rejected = 0,
    passed = 1, 
    processing = 2
};

export interface Borrow {
    id: number, //	借支ID
    createTime: string, //	创建时间
    amount: number, //	借支金额
    reason: string, //	理由
    status: BorrowStatus,
    dealDesc: string //	处理意见
};

export interface WorkTime {
    id: number, //	工时ID
    time: string, //	结算时间
    workTime: number,//	正常工时
    overTime: number, //	加班工时
    workSalary: number, //	正常时薪
    overSalary: number, //	加班时薪
    totalSalary: number, //	总计薪资
    settlementSalary: number, //	结算薪资
    confirm: boolean, //	是否确认
    settle: boolean, //	是否结算
    input: boolean, //	是否录入
};

enum MonthTimeOtherDetailedResponseType {
    increament = 1,
    decreament = 2
};

export interface MonthTimeOtherDetailedResponse {
    id: number, //	记录ID
    type: MonthTimeOtherDetailedResponseType, //	类型(1: 增加, 2: 扣除)
    price: number, //	金额
    title: string, //	内容
};

export interface WorkDetail {
    id: number, //	工时记录ID
    time: string, //	日期
    workTime: number, //	正常工时
    overTime: number, //	加班工时
    workSalary: number, //	正常时薪
    overSalary: number, //	加班时薪
    otherDetailedList: Array<MonthTimeOtherDetailedResponse>, //	其他工时明细，数组
    confirm: boolean, //	是否确认
    settle: boolean, //	是否结算
    settlementSalary: number, //	decimal	结算薪资
    totalSalary: number, //	decimal	总计薪资
    bankName: string, //	银行名称
    bankCard: string, //	银行卡号
    cardholder: string, //	持卡人姓名
};

export interface Work {
    minSalary: number, // decimal	最低工资
    maxSalary: number, //	decimal	最高工资
    companyName: string, //	公司名称
    companyJobName: string, //	岗位名称
    companyAddress: string, //	公司地址
    reportDate: string, //	入职时间
    quitTime: string,//	离职时间
    Labels: Array<string>
};

enum AreaLevel {
    province = 1,
    city = 2,
    county = 3
};

export interface Area {
    id: number, //	long	地区ID
    name: string, //	地区名称
    areaRank: AreaLevel, //int	地区等级(1: 省, 2: 市, 3: 县)
    parentId: number, //long	上级地区ID
    shortName: string, //	地区短名
    areaCode: string, //	地区编码
};

export interface Banner {
    back: string, //	Banner图片地址
    title: string, //	Banner标题
    content: string, //	Banner内容
    url: string, //	跳转地址
    type: number, //int	类型(1: 网页， 2: 招聘详情)
    recruitId: number, //long	招聘ID
    sort: number, //int	排序
};

export interface MyCustomerInfo {
    banlance: number, //	decimal	余额
    bankId: number, //	long	银行ID
    bankName: string, //	银行名称
    bankCard: string, //	银行卡号
    cardholder: string, //	持卡人姓名
    recommNum: number, //int	邀请人数
};

enum MyBalanceChangeHistoryType {
    increament = 1,
    decreament = 2
};

export interface MyBalanceChangeHistory {
    type: number, //	int	变动类型(1: 增加， 2: 减少)
    amount: number, //	decimal	变动金额
    name: string, //	变动名称
    createTime: string//	创建时间
};

const api = {
    customer: {
        sendAuthorizationCode(mobile: string, ticket: string, randomStr: string): ApiResult<string> {
            return axiosPost('/api/customer/sendAuthorizationCode', {mobile, ticket, randomStr}) as ApiResult<string>
        },
        login(param: LoginParam): ApiResult<{
            token: string,//	鉴权Token，需要鉴权的业务需要带上该Token识别身份
            tokenExpireTime: string,//	Token过期时间戳
            loginType: LoginType,// 登录方式(1: 手机号码登录, 2: 微信登陆)
            customerName: string,//	登陆用户名
            customerAvatar: string,//	用户头像
            customerNick: string,//	用户昵称
            hasProfile: boolean,//	是否填写个人信息
            hasBindMobile: boolean,// 是否绑定手机
        }> {
            return axiosPost('/api/customer/login', param)
        },
        bindDealer(mobile: string, code: string, requestId: string, dealerId: number): ApiResult<void> {
            return axiosPost('/api/customer/bindDealer', {mobile, code, requestId, dealerId})
        },
        submitProfile(p: SubmitProfileParam): ApiResult<void> {
            return axiosPost('/api/customer/submitProfile', p)
        },
        getProfile(): ApiResult<CustomerProfile> {
            return axiosPost('/api/customer/getProfile')
        },
        setLoginPass(code: string, requestId: string, newPass: string): ApiResult<void> {
            return axiosPost('/api/customer/setLoginPass', {code, requestId, newPass})
        },
        message: {
            list(p: PageParam): ApiResult<ListData<{
                id: number,	//消息ID
                title: string, //	消息标题
                content: string,//	消息内容
                read: boolean, //	是否已读
                createTime: string//	创建时间(yyyy-MM-dd)
            }>> {
                return axiosPost('/api/customer/message/list', p)
            },
            markAsRead(id: number): ApiResult<void> {
                return axiosPost('/api/customer/message/read', {id})
            },
            markAllAsRead(): ApiResult<void> {
                return axiosPost('/api/customer/message/allRead')
            }
        },
        jobSignupHistory: {
            list(pageSize: number = 20, pageNum: number = 1, status: JobSignupHistoryStatusEnum = JobSignupHistoryStatusEnum.all): ApiResult<ListData<JobSignupHistory>> {
                return axiosPost('/api/customer/jobSignupHistory/list', {pageSize, pageNum, status})
            }
        },
        uploadCustomerInfo(customerNick: string, customerAvatar: string): ApiResult<void> {
            return axiosPost('/api/customer/uploadCustomerInfo', {customerNick, customerAvatar})
        },
        getCustomerInfo(): ApiResult<CustomerInfo> {
            return axiosPost('/api/customer/getCustomerInfo')
        },
        getMyStationUser(): ApiResult<StationUser> {
            return axiosPost('/api/customer/getMyStationUser')
        },
        getMyWageCardInfo(): ApiResult<WageCardInfo> {
            return axiosPost('/api/customer/getMyWageCardInfo')
        },
        getMyWork(monthTimeId: number): ApiResult<Work> {
            return axiosPost('/api/customer/getMyWork', {monthTimeId})
        }

    },
    banner: {
        list(): ApiResult<ListData<Banner>> {
            return axiosPost('/api/banner/list')
        }
    },
    borrow: {
        submitBorrow(borrowAmount: number, reason: string): ApiResult<void> {
            return axiosPost('/api/borrow/submitBorrow', {borrowAmount, reason})
        },
        list(pageSize: number = 20, pageNum: number = 1): ApiResult<ListData<Borrow>> {
            return axiosPost('/api/borrow/list', {pageNum, pageSize})
        }
    },
    monthTime: {
        list(pageNum: number = 1, pageSize: number = 20): ApiResult<ListData<WorkTime>> {
            return axiosPost('/api/monthTime/list', {pageNum, pageSize})
        },
        detail(id: number): ApiResult<WorkDetail> {
            return axiosPost('/api/monthTime/detail', {id})
        },
        confirmMonthTime(id: number): ApiResult<void> {
            return axiosPost('/api/monthTime/confirmMonthTime', {id})
        }
    },
    complaint: {
        submit(type: number, complaintTypeId: number, content: string, evidences: Array<string>): ApiResult<void> {
            return axiosPost('/api/complaint/submit', {type, complaintTypeId, content, evidences})
        },
        list(p: PageParam): ApiResult<ListData<{
            id: number, //	反馈ID
            type: number,//	反馈类型(1: 意见反馈, 2: 投诉)
            complaintType: string, //	投诉类型
            content: string, //	反馈内容
            status:	number,//	状态(0: 未处理, 1: 已处理)
            createTime:	string, //	创建时间(yyyy-MM-dd HH:mm:ss)
            result:	string, //	处理结果
            evidences: Array<string>//	截图列表
        }>> {
            return axiosPost('/api/complaint/list', p)
        }
    },
    common: {
        getDictData(dictName: string): ApiResult<{
            id:	number,//	字典数据ID
            dictName: string,//	字典名称
            dataKey: string,//	字典数据名称
            dataValue: string, //	字典数据值
        }> {
            return axiosPost('/api/common/getDictData', {dictName})
        },
        uploadImage(file: File, serviceId: number): ApiResult<{
            fileSuffix:	string,//	文件后缀
            savePath: string,//	存储路径，任何提供图片地址的接口需要传入该地址
            previewPath: string,//	预览地址，请不要将该地址传入任何需要传入图片地址的接口
            fileMd5: string,//	文件MD5值
        }> {
            return axiosPost('/api/common/uploadImage', {file, serviceId})
        }
    },
    area: {
        queryAllArea(level: AreaLevel): ApiResult<ListData<Area>> {
            return axiosPost('/api/area/queryAllArea', {level})
        },
        queryAreaByParent(parentId: number): ApiResult<ListData<Area>> {
            return axiosPost('/api/area/queryAreaByParent', {parentId})
        }
    },
    recruit: {
        list(p: RecruitParam): ApiResult<ListData<{
            id: number,//	招聘信息ID
            title: string,//	招聘标题
            minSalary: number,//	最低招聘工资
            maxSalary: number,//	最高招聘工资
            companyAddress:	string,//	公司地址
            estimateNumber:	number,//	预计招聘人数
            recruitNumber: number,//	已报名人数
            recruitLabels: Array<string>//	招聘标签列表，数组类型
        }>> {
            return axiosPost('/api/recruit/list', p)
        },
        getSearchParams(): ApiResult<Array<{
            id: number,
            labelName: string,
            detailList: Array<{
                id: number,
                itemName: string
            }>
        }>> {
            return axiosPost('/api/recruit/getSearchParams')
        },
        detail(id: number): ApiResult<{
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
            return axiosPost('/api/recruit/detail', {id})
        },
        signup(recruitId: number): ApiResult<void> {
            return axiosPost('/api/recruit/signup', {recruitId})
        }
    },
    wx: {
        getWxConfigInfo(wxKey: string): ApiResult<{appId: string, state: string}> {
            return axiosPost('/api/wx/getWxConfigInfo', {wxKey})
        }, 
        auth(code: string, state: string, wxKey: string): ApiResult<WXLoginResult> {
            return axiosPost('/api/wx/auth', {code, state, wxKey})
        }
    },
    recommend: {
        getMyCustomerInfo(): ApiResult<MyCustomerInfo> {
            return axiosPost('/api/recommend/getMyCustomerInfo')
        },
        submitMyBankInfo(bankId: number, bankCard: string, cardholder: string): ApiResult<void> {
            return axiosPost('/api/recommend/submitMyBankInfo', {bankId, bankCard, cardholder})
        },
        getMyBalanceChangeHistory(pageNum: number = 1, pageSize: number = 20): ApiResult<ListData<MyBalanceChangeHistory>> {
            return axiosPost('/api/recommend/getMyBalanceChangeHistory', {pageNum, pageSize})
        },
        withdrawal(amount: number): ApiResult<void> {
            return axiosPost('/api/recommend/withdrawal', {amount})
        }
    }
};

export default api;

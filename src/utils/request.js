import axios from 'axios'
import {
    MessageBox,
    Message
} from 'element-ui'
import store from '@/store'
import {
    getToken,
    removeToken
} from '@/utils/auth'

// create an axios instance
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // process.env.VUE_APP_BASE_API
    withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000 // request timeout
})
axios.defaults.baseURL = 'http://site.wei.raytonecn.com/server/public/api/v1/'


axios.interceptors.request.use(config => {
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    var token = localStorage.getItem('token')
        // console.log(getToken())
    if (token) {
        config.headers.common['token'] = token
    }
    return config
}, err => {
    return Promise.reject(err)
})

axios.interceptors.response.use(response => {
    var a = response.data && response.data.list && response.data.list.per_page
    if (response.data.code === 201 && a) {
        localStorage.setItem("listSize", a);
    }

    if (response.data.error_code === 50000) {
        localStorage.removeItem('token');
        removeToken()
        location.reload()
    }
    if (response.data.error_code === 90000) {
        Message({
            showClose: true,
            message: response.data.msg,
            type: 'error',
            duration: 5 * 1000
        })
        return
    }
    return response
}, error => {
    if (error.response.data.error_code == 50000) {
        localStorage.removeItem('token');
        location.reload()
    }
    if (error.response.data.error_code == 50003) {
        Message({
            showClose: true,
            message: '账号或密码错误',
            type: 'error',
            duration: 5 * 1000
        })
    }
    if (error.data.code !== 200) {
        localStorage.removeItem('token');
        location.reload()
    }
    return error
})

// request interceptor
service.interceptors.request.use(
    config => {
        // do something before request is sent

        if (store.getters.token) {
            // let each request carry token
            // ['X-Token'] is a custom headers key
            // please modify it according to the actual situation
            config.headers['token'] = getToken()
        }
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(

    response => {
        const res = response.data

        // if the custom code is not 20000, it is judged as an error.
        if (res.code !== 20000) {
            // Message({
            //   message: res.message || 'Error',
            //   type: 'error',
            //   duration: 5 * 1000
            // })

            // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
            if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
                localStorage.removeItem('token');
                location.reload()
            }
            return Promise.reject(new Error(res.message || 'Error'))
        } else {
            return res
        }
    },
    error => {
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

// 后台登录接口-验证用户名是否存在
export const checkUser = params => {
    return axios.post('token/app/platform', params).then(res => res.data)
}

// 登录验证
export const appLogin = params => {
    return axios.post('token/app/login', params).then(res => res.data)
}

// 后台登录接口-退出登录注销token
export const appLogut = params => {
    return axios.post('token/app/logut', params).then(res => res.data)
}

// 后台登录接口-检查token存在
export const appIstoken = params => {
    return axios.post('token/app/istoken', params).then(res => res.data)
}

// 管理员列表 
export const ruleusersList = params => {
    return axios.get('ruleusers/worker/list?page=' + params.page + "&size=" + params.size).then(res => res.data)
}

// 管理员添加 
export const ruleusersAdd = params => {
    return axios.post('ruleusers/worker/add', params).then(res => res.data)
}

// 管理员删除 
export const ruleusersDelete = params => {
    return axios.post('ruleusers/worker/delete?uid=' + params).then(res => res.data)
}

// 管理员修改
export const ruleusersUpdate = params => {
    return axios.post('ruleusers/worker/update', params).then(res => res.data)
}

// 菜单和权限列表 
export const modulesruleLi = params => {
    return axios.get('modulesrule/worker/list').then(res => res.data)
}

// 菜单和权限的一级菜单简介：一级菜单，添加规则和修改规则的时候选择的上级 
export const modulesruleMenu = params => {
    return axios.post('modulesrule/worker/menu', params).then(res => res.data)
}

// 菜单和权限添加 
export const modulesruleAdd = params => {
    return axios.post('modulesrule/worker/add', params).then(res => res.data)
}

// 菜单和权限删除 
export const modulesruleDelete = params => {
    return axios.post('modulesrule/worker/delete?rule_id=' + params).then(res => res.data)
}

// 菜单和权限修改 
export const modulesruleUpdate = params => {
    return axios.post('modulesrule/worker/update', params).then(res => res.data)
}

// 菜单和权限详情 
export const modulesruleDetail = params => {
    return axios.post('modulesrule/worker/detail', params).then(res => res.data)
}

// 公司主管理员列表
export const workerList = params => {
    return axios.get('filialeusers/worker/list?page=' + params.page + "&size=" + params.size).then(res => res.data)
}

// 公司主管理员添加
export const workerAdd = params => {
    return axios.post('filialeusers/worker/add', params).then(res => res.data)
}

// 公司主管理员删除
export const workerDelete = params => {
    return axios.post('filialeusers/worker/delete?uid=' + params).then(res => res.data)
}

// 公司主管理员详情
export const workerDetail = params => {
    return axios.post('filialeusers/worker/detail', params).then(res => res.data)
}

// 公司主管理员修改
export const workerUpdate = params => {
    return axios.post('filialeusers/worker/update', params).then(res => res.data)
}

// 分公司主管理员-菜单列表
export const workList = params => {
    return axios.post('modulesmenu/worker/list?uid=' + params).then(res => res.data)
}

// 分公司主管理员-添加权限
export const workOperator = params => {
    return axios.post('modulesmenu/worker/operator', params).then(res => res.data)
}

// 分公司主管理员-所有权限列表
export const workPort = params => {
    return axios.post('modulesmenu/worker/port', params).then(res => res.data)
}

// 分公司普通管理员-菜单列表
export const modulesmenu = params => {
    return axios.post('modulesmenu/worker/lists', params).then(res => res.data)
}

// 分公司普通管理员-添加权限
export const operators = params => {
    return axios.post('modulesmenu/worker/operators', params).then(res => res.data)
}

// 分公司普通管理员-所有权限列表
export const modulPorts = params => {
    return axios.post('modulesmenu/worker/ports', params).then(res => res.data)
}

// 分组缓存列表
export const workCaches = params => {
    return axios.post('rulegroup/worker/caches', params).then(res => res.data)
}

// 分组列表
export const workListed = params => {
    return axios.get('rulegroup/worker/list?page=' + params.page + "&size=" + params.size).then(res => res.data)
}

// 分组列表 -添加
export const workAdd = params => {
    return axios.post('rulegroup/worker/add', params).then(res => res.data)
}

// 外链信息列表
export const outersList = params => {
    return axios.get('outers/worker/list?size=' + params.size + '&page=' + params.page).then(res => res.data)
}

// 外链信息 获取指定模块外链
export const getOuter = params => {
    return axios.get('outers/worker/getOuter?signs=' + params).then(res => res.data)
}

// 外链信息添加
export const outersAdd = params => {
    return axios.post('outers/worker/add', params).then(res => res.data)
}

// 外链信息删除
export const outersDel = params => {
    return axios.post('outers/worker/delete?outer_id=' + params).then(res => res.data)
}

// 外链信息修改
export const outersUpdate = params => {
    return axios.post('outers/worker/update', params).then(res => res.data)
}

// 外链信息详情
export const outersDetail = params => {
    return axios.post('outers/worker/detail', params).then(res => res.data)
}

// 收费记录列表
export const chargesList = params => {
    return axios.get('charges/worker/list?page=' + params.page + '&size=' + params.size + '&keyword=' + params.keyword).then(res => res.data)
}

// 收费记录添加
export const chargesAdd = params => {
    return axios.post('charges/worker/add', params).then(res => res.data)
}

// 收费记录删除
export const chargesDel = params => {
    return axios.post('charges/worker/delete?charges_id=' + params).then(res => res.data)
}

// 收费记录修改
export const chargesUpdate = params => {
    return axios.post('charges/worker/update', params).then(res => res.data)
}

//收费记录详情
export const chargesDetail = params => {
    return axios.post('charges/worker/detail', params).then(res => res.data)
}

//统计信息-价格统计
export const statisticsLi = params => {
    return axios.get('statistics/worker/list').then(res => res.data)
}

//统计信息-官网统计
export const statisticsCounts = params => {
    return axios.get('statistics/worker/counts?page=' + params.page + "&size=" + params.size).then(res => res.data)
}

//统计信息-行业统计
export const statisticsGuilds = params => {
    return axios.get('statistics/worker/guilds?guild=' + params.guild).then(res => res.data)
}

//分公司主管理员的菜单列表
export const guildsList = params => {
    return axios.post('guilds/worker/list', params).then(res => res.data)
}

//行业列表 -所有行业和对应菜单
export const guildsGetLi = params => {
    return axios.post('guilds/worker/getlist', params).then(res => res.data)
}

//行业列表 -选中行业对应的菜单
export const getguild = params => {
    return axios.post('guilds/worker/getguild', params).then(res => res.data)
}




export default service
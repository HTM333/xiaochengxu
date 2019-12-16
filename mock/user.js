const tokens = {
    admin: {
        token: 'admin-token'
    },
    editor: {
        token: 'editor-token'
    },
    youke: {
        token: 'youke-token'
    }
}

const users = {
    'admin-token': {
        roles: ['admin'],
        introduction: '我是超级管理员',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: '超级管理员'
    },
    'editor-token': {
        roles: ['editor'],
        introduction: '我是一个普通编辑',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: '普通编辑'
    },
    'youke-token': {
        roles: ['youke'],
        introduction: '我是一个游客',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: '普通游客'
    }
}

export default [

    // user login
    {
        url: '/user/login',
        type: 'post',
        response: config => {
            const { username } = config.body
            const token = tokens[username]
            console.log(token, 'token')

            // mock error
            if (!token) {
                return {
                    code: 60204,
                    message: '帐户或密码不正确'
                }
            }

            return {
                code: 20000,
                data: token
            }
        }
    },

    // get user info
    {
        url: '/user/info\.*',
        type: 'get',
        response: config => {
            const { token } = config.query
            const info = users[token]
            console.log(info, 'token')
                // mock error
            if (!info) {
                return {
                    code: 50008,
                    message: '登录失败，无法获取用户详细信息.'
                }
            }

            return {
                code: 20000,
                data: info
            }
        }
    },

    // 退出登录
    {
        url: '/user/logout',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    }
]
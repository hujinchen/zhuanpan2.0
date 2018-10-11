module.exports = {
    securityUrl:'op=onlogin',//安全验证，将code传给服务器端，使用登录凭证 code 获取 session_key 和 openid
    loginUrl: 'op=getUserInfo',//登陆接口
    uploadScore: 'op=score',//上报分数
    rankUrl:'op=total',//查询排行榜
    rankZhili:'op=getTop',//智力榜
    getShareInfo:'op=getShareInfo',
    getConfig: 'op=config',
    getQuestion:'op=idiom',
    getHighestScore:'op=highscore',
    coin: 'op=coin',
    role:'op=game_rule',
    music:'op=music_hb',
    help:'op=help',
    uploadPrize:'op=gift',
    mygift:'op=mygift',
    prizeRole: 'op=gift_info',
    getPayStatus: 'op=payStatus',
    payConfig: 'op=payconfig',
    form:'op=form',
    ban:'op=ban',

    //打假专用
    getDajiaQuestion: 'op=dajia',
    //智力测试专用
    getZhiliQuestion: 'op=zhili',

    //权限
    auth:{
        manager:"0",
        normal:"1"
    },
};
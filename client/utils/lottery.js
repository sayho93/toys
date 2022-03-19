import moment from 'moment'

export const getWeek = () => {
    const t1 = moment('2002-12-07 21:00:00', 'YYYY-MM-DD hh:mm:ss')
    const t2 = moment()
    // const t2 = moment('2022-03-12 21:01:00', 'YYYY-MM-DD hh:mm:ss')
    const dff = moment.duration(t2.diff(t1)).asDays()
    return Math.ceil(dff / 7) + 1
}

export const parseUrl = url => {
    // https://m.dhlottery.co.kr/qr.do?method=winQr&v=1005q012728404143q040716323644q131934364244q010607161726q0309102021231055931743
    const roundNo = url.match(/v=(\d+)/)[1]
    // const nums = url.match(/(?<=q)\d{12}/g)  //lookbehind do not support non-v8 engine
    let nums = url.match(/(?!q)\d{12}/g)
    nums = nums.map(num =>
        num.split('').reduce((acc, item, idx, origin) => {
            if (idx % 2 === 1) {
                const chunk = origin[idx - 1] + item
                if (/\d{2}/.test(chunk)) acc.push(+chunk)
            }
            return acc
        }, [])
    )
    return {roundNo, nums}
}

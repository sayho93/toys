const HeaderInfo = {
    Home: {
        title: 'Toys',
        icon: 'bi-gear-wide-connected',
        searchBar: true,
        menus: [],
    },
    LotGen: {
        title: 'LotGen',
        icon: 'bi-cash-stack',
        searchBar: true,
        menus: [
            {name: 'Home', link: '/lotgen'},
            {name: 'History', link: '/lotgen/history'},
            {name: 'Hall of fame', link: '/lotgen/hallOfFame'},
        ],
    },
    Planner: {
        title: 'Planner',
        icon: 'bi-calendar-event',
        searchBar: false,
        menus: [],
    },
    'Minimal Flex': {
        title: 'Minimal Flex',
        icon: 'bi-camera-fill',
        searchBar: true,
        menus: [],
    },
    Tutorial: {
        title: 'Tutorial',
        icon: 'bi-code-slash',
        searchBar: false,
        menus: [],
    },
}

export default HeaderInfo

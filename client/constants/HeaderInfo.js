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
    Shortener: {
        title: 'Shortener',
        icon: 'bi-link',
        searchBar: false,
        menus: [],
    },
    Planner: {
        title: 'Planner',
        icon: 'bi-calendar-event',
        searchBar: false,
        menus: [],
    },
    Chat: {
        title: 'Chat',
        icon: 'bi-chat-fill',
        searchBar: false,
        menus: [],
    },
    'Minimal Flex': {
        title: 'Minimal Flex',
        icon: 'bi-camera-fill',
        searchBar: true,
        menus: [
            {name: 'Feed', link: '/minimalFlex'},
            {name: 'My story', link: '/minimalFlex/myStory'},
        ],
    },
    Tutorial: {
        title: 'Tutorial',
        icon: 'bi-code-slash',
        searchBar: false,
        menus: [],
    },
}

export default HeaderInfo

import {
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'

import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    {
        key: 'dashboard',
        path: '/dashboard',
        title: 'Dashboard',
        translateKey: 'nav.dashboard',
        icon: 'dashboard',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'users',
        path: '/users',
        title: 'Users',
        translateKey: 'nav.users',
        icon: 'users',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'company',
        path: '/company',
        title: 'Company',
        translateKey: 'nav.company',
        icon: 'building',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
]

export default navigationConfig

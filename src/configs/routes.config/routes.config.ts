import authRoute from './authRoute'
import { SUPERADMIN_MASTER, SUPERADMIN_STAFF } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

export const protectedRoutes: Routes = {
    '/home': {
        key: 'home',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/dashboard': {
        key: 'dashboard',
        authority: [SUPERADMIN_MASTER, SUPERADMIN_STAFF],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/users': {
        key: 'users',
        authority: [SUPERADMIN_MASTER],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/company': {
        key: 'company',
        authority: [SUPERADMIN_MASTER, SUPERADMIN_STAFF],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/pricing-plans': {
        key: 'pricing-plans',
        authority: [SUPERADMIN_MASTER, SUPERADMIN_STAFF],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
}

export const publicRoutes: Routes = {}

export const authRoutes = authRoute

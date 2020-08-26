import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Camera from '@/components/entities/Camera'
import Clip from '@/components/entities/Clip'
import Detection from '@/components/entities/Detection'
import Bridge from '@/components/entities/Bridge'
import Track from '@/components/entities/Track'
import BridgeOverview from '@/components/BridgeOverview'
import BridgeSelected from '@/components/BridgeSelected'

import store from "@/store";

Vue.use(Router);

let router = new Router({
    mode: 'history',
    routes: [{
            path: "/",
            name: "home",
            component: Home,
        },
        {
            path: '/bridge-overview',
            name: 'bridge-overview',
            component: BridgeOverview,
            meta: {
                requiresAuth: false,
            }
        },
        {
            path: '/bridge/:name',
            name: 'bridge-selected',
            props: true,
            component: BridgeSelected,
            meta: {
                requiresAuth: false,
            },
        },
        {
            path: '/entity/camera',
            name: 'entity-camera',
            component: Camera,
            meta: {
                requiresAuth: false,
            }
        },
        {
            path: '/entity/clip',
            name: 'entity-clip',
            component: Clip,
            meta: {
                requiresAuth: false,
            }
        },
        {
            path: '/entity/detection',
            name: 'entity-detection',
            component: Detection,
            meta: {
                requiresAuth: false,
            }
        },
        {
            path: '/entity/bridge',
            name: 'entity-bridge',
            component: Bridge,
            meta: {
                requiresAuth: false,
            }
        },
        {
            path: '/entity/track',
            name: 'entity-track',
            component: Track,
            meta: {
                requiresAuth: false,
            }
        },
    ]
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.state.auth.isAuthenticated == false) {
            // attempt authentication with existing jwt token, else show login modal
            store.dispatch('auth/authenticateOrToggleModal', next)
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
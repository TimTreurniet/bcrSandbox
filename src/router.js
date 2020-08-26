import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
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
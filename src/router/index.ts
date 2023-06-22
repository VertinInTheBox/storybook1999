import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/player/:id',
            name: 'player',
            component: () => import('@/views/Player/PlayerIndex.vue')
        }
    ]
})

export default router

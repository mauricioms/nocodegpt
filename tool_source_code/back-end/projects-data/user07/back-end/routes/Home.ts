import express from 'express'
const router = express.Router()

router.get('/teste', (req: any, res: any) => {
  const _username: string = (req['user'] as { username: string }).username
  return res.json({ username: _username })
})

export default router

import { Router } from 'express';
import * as UserService from '@/service/user';
import Auth from '@/middlewares/auth';
const router = Router();
router.post('/register', (req, res) => {
  try {
    UserService.create(req.body);
    res.send('ok');
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.post('/login', (req, res) => {
  try {
    const token = UserService.login(req.body);
    res.cookie('authorization', token, { maxAge: 1000 * 60 * 60 * 24 * 14, httpOnly: true }).send('ok');
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.get('/confirm', (req, res) => {
  try {
    UserService.mailAccountConfirmation(req.query.token);
    res.send('ok');
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.get('/send-confirmation', (req, res) => {
  try {
    UserService.sendMailAccountConfirmation(req.query.email);
    res.send('ok');
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.post('/change-password', (req, res) => {
  try {
    UserService.changePassword(req.body);
    res.send('ok');
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.get('/', Auth);
router.get('/', (req, res) => {
  res.json(UserService.getAll());
});
export default router;

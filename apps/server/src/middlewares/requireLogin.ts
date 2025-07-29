import type { NextFunction, Request, Response } from 'express'

export function requireLogin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.uid) {
    res.status(401).json({ message: 'Please log in' })
  }
  else {
    next()
  }
}

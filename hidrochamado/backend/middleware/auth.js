import jwt from 'jsonwebtoken';

export function autenticar(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

export function autorizar(...funcoesPermitidas) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    if (!funcoesPermitidas.includes(req.usuario.funcao)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    next();
  };
}

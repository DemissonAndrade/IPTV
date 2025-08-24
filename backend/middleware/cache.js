const NodeCache = require('node-cache');

// Cache com TTL de 5 minutos para canais, 1 minuto para EPG
const cache = new NodeCache({ 
  stdTTL: 300, // 5 minutos
  checkperiod: 60, // verificar expiração a cada 1 minuto
  useClones: false 
});

class CacheService {
  // Cache para queries de canais
  static getChannelsKey(filters, page, limit) {
    const keyParts = ['channels', JSON.stringify(filters), page, limit];
    return keyParts.join(':');
  }

  static get(key) {
    return cache.get(key);
  }

  static set(key, value, ttl = 300) {
    return cache.set(key, value, ttl);
  }

  static del(key) {
    return cache.del(key);
  }

  static flush() {
    return cache.flushAll();
  }

  // Métodos específicos
  static invalidateChannels() {
    const keys = cache.keys().filter(key => key.startsWith('channels:'));
    cache.del(keys);
  }

  static invalidateEPG() {
    const keys = cache.keys().filter(key => key.startsWith('epg:'));
    cache.del(keys);
  }

  static getStats() {
    return cache.getStats();
  }
}

// Middleware para cache
const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    const key = `__express__${req.originalUrl || req.url}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      res.send(cachedResponse);
      return;
    }

    res.sendResponse = res.send;
    res.send = (body) => {
      cache.set(key, body, duration);
      res.sendResponse(body);
    };

    next();
  };
};

module.exports = { CacheService, cacheMiddleware };

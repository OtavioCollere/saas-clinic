export const TOKEN_BUCKET_LUA = `
-- KEYS[1] = chave do bucket no Redis
-- ARGV[1] = capacidade máxima
-- ARGV[2] = taxa de recarga (tokens/segundo)
-- ARGV[3] = timestamp atual

local bucket = redis.call("HMGET", KEYS[1], "tokens", "lastRefill")
local tokens = tonumber(bucket[1])
local lastRefill = tonumber(bucket[2])

if tokens == nil then
  tokens = tonumber(ARGV[1])
  lastRefill = tonumber(ARGV[3])
end

local delta = math.max(0, ARGV[3] - lastRefill)
local refill = delta * tonumber(ARGV[2])
tokens = math.min(tonumber(ARGV[1]), tokens + refill)

if tokens < 1 then
  redis.call("HMSET", KEYS[1], "tokens", tokens, "lastRefill", ARGV[3])
  redis.call("EXPIRE", KEYS[1], math.ceil(ARGV[1] / ARGV[2]))
  return 0
end

tokens = tokens - 1

redis.call("HMSET", KEYS[1], "tokens", tokens, "lastRefill", ARGV[3])
redis.call("EXPIRE", KEYS[1], math.ceil(ARGV[1] / ARGV[2]))

return 1
`;

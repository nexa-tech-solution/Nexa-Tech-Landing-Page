-- Edge Functions use a shared counter so rate limiting spans instances.
CREATE TABLE IF NOT EXISTS contact.rate_limits (
  ip_hash text NOT NULL,
  window_start bigint NOT NULL,
  hits integer NOT NULL,
  PRIMARY KEY(ip_hash, window_start)
);
REVOKE ALL ON contact.rate_limits FROM anon, authenticated;

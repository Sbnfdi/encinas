import { useState, useEffect } from 'react';
import type { FC, FormEvent } from 'react';
import { Lock, Eye, EyeOff, X, ShieldAlert, Sparkles } from 'lucide-react';
import { BrandLogo } from '../brand/BrandLogo';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: () => void;
}

export const AdminLoginModal: FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccessLogin }) => {
  const [accessKey, setAccessKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const MASTER_KEY = 'UsamasamUsamaalikhannominomannomanalikhanabdullahabdullahzahidabdullahzahidraja';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const trimmed = accessKey.trim();
      if (trimmed === MASTER_KEY) {
        if (rememberSession) {
          localStorage.setItem('encinas_admin_auth', 'true');
        }
        sessionStorage.setItem('encinas_admin_auth', 'true');
        setIsLoading(false);
        onSuccessLogin();
      } else {
        setIsLoading(false);
        setError('Invalid sovereign access key. Access denied.');
      }
    }, 400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 250,
        backgroundColor: 'rgba(5, 5, 5, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-panel-gold"
        style={{
          width: '100%',
          maxWidth: '440px',
          borderRadius: '4px',
          overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 40px rgba(197, 168, 128, 0.15)',
          position: 'relative',
        }}
      >
        {/* Top gold decorative hairline */}
        <div
          style={{
            height: '2px',
            width: '100%',
            background: 'linear-gradient(90deg, transparent, var(--gold-light), transparent)',
          }}
        />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s',
            minHeight: '40px',
            minWidth: '40px',
          }}
          aria-label="Close CMS login gateway"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <div style={{ padding: '2.5rem 2rem 2.25rem 2rem' }}>
          {/* Header Branding */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                margin: '0 auto 1rem auto',
                borderRadius: '50%',
                background: 'rgba(197, 168, 128, 0.08)',
                border: '1px solid var(--border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
              }}
            >
              <BrandLogo variant="icon" color="gold" size={32} />
            </div>

            <div
              style={{
                fontSize: '0.66rem',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'var(--gold-primary)',
                fontWeight: 600,
                marginBottom: '0.35rem',
              }}
            >
              PRIVATE DESK SECURITY GATEWAY
            </div>

            <h2
              id="admin-login-modal-title"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.55rem',
                fontWeight: 700,
                color: '#FFF',
                letterSpacing: '0.04em',
              }}
            >
              ENCINAS CMS BUILDER
            </h2>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.5 }}>
              Authorized operational access for architectural timeline curation and portfolio inventory.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              role="alert"
              aria-live="assertive"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.75rem 1rem',
                borderRadius: '2px',
                backgroundColor: 'rgba(218, 54, 51, 0.12)',
                border: '1px solid rgba(218, 54, 51, 0.35)',
                color: '#FF7B72',
                fontSize: '0.8rem',
                marginBottom: '1.25rem',
              }}
            >
              <ShieldAlert size={16} aria-hidden="true" style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <label
                  htmlFor="admin-access-key"
                  style={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--gold-light)',
                    fontWeight: 600,
                  }}
                >
                  Sovereign Master Passkey
                </label>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  id="admin-access-key"
                  type={showPassword ? 'text' : 'password'}
                  required
                  aria-required="true"
                  autoFocus
                  value={accessKey}
                  placeholder="Enter Sovereign Master Passkey"
                  onChange={(e) => setAccessKey(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 2.75rem 0.85rem 2.6rem',
                    background: 'rgba(10, 10, 10, 0.8)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: '2px',
                    color: '#FFF',
                    fontSize: '0.9rem',
                    letterSpacing: '0.08em',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                    minHeight: '44px',
                  }}
                />
                <Lock
                  size={15}
                  color="var(--gold-primary)"
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password characters' : 'Show password characters'}
                  style={{
                    position: 'absolute',
                    right: '0.9rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
                </button>
              </div>
            </div>

            {/* Remember Session */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <input
                type="checkbox"
                id="rememberSession"
                checked={rememberSession}
                onChange={(e) => setRememberSession(e.target.checked)}
                style={{
                  accentColor: 'var(--gold-primary)',
                  cursor: 'pointer',
                  width: '14px',
                  height: '14px',
                }}
              />
              <label
                htmlFor="rememberSession"
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                Keep management session authenticated
              </label>
            </div>

            {/* Unlock Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-gold"
              style={{
                width: '100%',
                padding: '0.9rem',
                fontSize: '0.78rem',
                letterSpacing: '0.18em',
                marginTop: '0.5rem',
              }}
            >
              {isLoading ? (
                <span>VERIFYING CREDENTIALS...</span>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>AUTHORIZE & UNLOCK CMS</span>
                </>
              )}
            </button>
          </form>

          {/* Security footnote */}
          <div
            style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              textAlign: 'center',
              fontSize: '0.7rem',
              color: 'var(--text-dim)',
              letterSpacing: '0.04em',
            }}
          >
            Sovereign Boardroom Protocol • 256-Bit Cryptographic Session
          </div>
        </div>
      </div>
    </div>
  );
};

function AuthFooter({ compact = false }) {
  function keepFooterLinksInPlace(event) {
    event.preventDefault();
  }

  return (
    <footer className={`auth-footer${compact ? ' auth-footer--compact' : ''}`}>
      <div className="auth-footer__inner">
        <div className="auth-footer__brand">Lo&rsquo;ma</div>
        <div className="auth-footer__links">
          <a href="/privacy" onClick={keepFooterLinksInPlace}>Privacy Policy</a>
          <a href="/terms" onClick={keepFooterLinksInPlace}>Terms of Service</a>
          <a href="/sustainability" onClick={keepFooterLinksInPlace}>Sustainability Report</a>
        </div>
        <div className="auth-footer__copy">
          &copy; 2026 Lo&rsquo;ma. Reduce food waste.
        </div>
      </div>
    </footer>
  );
}

export default AuthFooter;

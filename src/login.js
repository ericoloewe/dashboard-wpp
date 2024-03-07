import { useAuth } from "./contexts/auth"

export function Login() {
  const { doLogin, qrcode, isLoadingAuth } = useAuth()

  return <header className="App-header">
    <img src={qrcode || './logo.png'} className={`App-logo qrcode-ok`} alt="logo" />

    {!qrcode && (
      <button type='button' className='btn btn-primary' onClick={e => doLogin()} disabled={isLoadingAuth}>
        {isLoadingAuth
          ? <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...</>
          : <>Entrar / Gerar Qr Code</>}
      </button>
    )}
  </header>
}

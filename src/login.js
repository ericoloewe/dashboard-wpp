import { useAuth } from "./contexts/auth"

export function Login() {
  const { doLogin, qrcode, isLoadingAuth } = useAuth()

  return <header className="App-header">
    {qrcode
      ? (
        <>
          <img src={qrcode} className={`App-logo qrcode-ok`} alt="logo" />
          <h3>Para entrar no dashboard, leia o QR CODE através do seu WhatsApp</h3>
        </>
      )
      : (
        <>
          <img src={'./logo.png'} className={`App-logo qrcode-ok`} alt="logo" />
          <h1>Dashboard de Gestão do WhatsApp</h1>

          <button type='button' className='btn btn-primary' onClick={e => doLogin()} disabled={isLoadingAuth}>
            {isLoadingAuth
              ? <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...</>
              : <>Entrar / Gerar Qr Code</>}
          </button>
        </>
      )}
  </header>
}

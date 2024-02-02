interface Props {
    setAlias (alias : string) : void
    setPassword (password : string) : void
    marginBottom : boolean
}

export const AuthFields = (props : Props) => {
    return (
        <>
            <div className="form-floating">
                <input
                    type="text"
                    className="form-control"
                    size={50}
                    id="aliasInput"
                    placeholder="name@example.com"
                    onChange={(event) => props.setAlias(event.target.value)}
                />
                <label htmlFor="aliasInput">Alias</label>
            </div>
            <div className={`form-floating ${props.marginBottom ? 'mb-3' : ''}`}>
                <input
                    type="password"
                    className={`form-control ${props.marginBottom ?? 'bottom'}`}
                    id="passwordInput"
                    placeholder="Password"
                    onChange={(event) => props.setPassword(event.target.value)}
                />
                <label htmlFor="passwordInput">Password</label>
            </div>
        </>
    );
}
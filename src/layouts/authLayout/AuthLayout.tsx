import { Outlet } from "react-router-dom";

const AuthLayout = () => {

    return (
        <div className="authLayout">
            <Outlet />
        </div>
    );
}

export default AuthLayout;
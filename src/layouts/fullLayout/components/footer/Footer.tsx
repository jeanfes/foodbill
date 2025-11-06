import LogoTransparent from "@/assets/images/logoTransparent.png";
import "./footer.scss";

const socialMedia = [
    { id: 1, name: "Facebook", icon: <></>, link: "" },
    { id: 2, name: "Twitter", icon: <></>, link: "" },
    { id: 3, name: "Youtube", icon: <></>, link: "" },
    { id: 4, name: "Instagram", icon: <></>, link: "" },
];

export const Footer = () => {
    return (
        <footer className="footer">
            <header className="footerHeader">
                <img src={LogoTransparent} alt="logo" className="footerLogo" />
                <p>¿Tienes sugerencias?</p>
            </header>

            <div className="footerBody">
                <address className="footerContact">
                    <a href="mailto:prizma@americana.edu.co">prizma@americana.edu.co</a> - Tel. (57) xxxxxxx - Barranquilla, Colombia
                </address>

                <nav className="socialMedia" aria-label="Redes sociales">
                    <ul>
                        {socialMedia.map((item) => (
                            <li key={item.id}>
                                <a
                                    href={item.link || "#"}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="socialMediaItem"
                                    aria-label={item.name}
                                >
                                    {item.icon}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <p className="footerSuggestion">¿Tienes sugerencias?</p>
            </div>
        </footer>
    );
};
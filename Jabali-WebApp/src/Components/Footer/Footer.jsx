import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { useTheme } from "../Context/ThemeContext";

const Footer = () => {
  const { currentTheme } = useTheme();
  const { colors } = currentTheme;

  const styles = {
    footer: {
      background: colors.surface,
      color: colors.text,
      padding: "60px 20px 25px",
      fontFamily: currentTheme.typography.fontFamily,
      transition: "all 0.3s ease",
    },
    container: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "40px",
      maxWidth: "1100px",
      margin: "auto",
    },
    title: {
      color: colors.primary,
      marginBottom: "15px",
      fontSize: "1.2rem",
    },
    text: {
      lineHeight: "1.6",
      fontSize: "0.95rem",
      color: colors.textSecondary,
    },
    link: {
      color: colors.textSecondary,
      textDecoration: "none",
      transition: "0.3s",
    },
    linkHover: {
      color: colors.primary,
    },
    logo: {
      color: colors.primary,
      fontSize: "1.8rem",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    icons: {
      display: "flex",
      gap: "15px",
      marginTop: "10px",
    },
    icon: {
      color: colors.text,
      fontSize: "1.3rem",
      transition: "0.3s ease",
    },
    bottom: {
      textAlign: "center",
      borderTop: `1px solid ${colors.border}`,
      marginTop: "50px",
      paddingTop: "20px",
      fontSize: "0.9rem",
      color: colors.textSecondary,
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Brand Section */}
        <div>
          <h2 style={styles.logo}>Jabali App</h2>
          <p style={styles.text}>
            Supporting children under the spectrum through technology, compassion,
            and community. Together, we grow stronger — one step at a time.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 style={styles.title}>Quick Links</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {["Home", "About", "Features", "Contact"].map((link) => (
              <li key={link} style={{ marginBottom: "10px" }}>
                <a
                  href={`/${link.toLowerCase()}`}
                  style={styles.link}
                  onMouseOver={(e) =>
                    (e.target.style.color = colors.primary)
                  }
                  onMouseOut={(e) =>
                    (e.target.style.color = colors.textSecondary)
                  }
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 style={styles.title}>Resources</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {["Guides", "Community", "FAQ", "Blog"].map((res) => (
              <li key={res} style={{ marginBottom: "10px" }}>
                <a
                  href={`/${res.toLowerCase()}`}
                  style={styles.link}
                  onMouseOver={(e) =>
                    (e.target.style.color = colors.primary)
                  }
                  onMouseOut={(e) =>
                    (e.target.style.color = colors.textSecondary)
                  }
                >
                  {res}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 style={styles.title}>Connect With Us</h3>
          <div style={styles.icons}>
            {[FaFacebookF, FaTwitter, FaInstagram, FaYoutube].map((Icon, i) => (
              <a
                key={i}
                href="/"
                style={styles.icon}
                onMouseOver={(e) =>
                  (e.target.style.color = colors.primary)
                }
                onMouseOut={(e) =>
                  (e.target.style.color = colors.text)
                }
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={styles.bottom}>
        <p>© {new Date().getFullYear()} Jabali App. All rights reserved.</p>
        <p>Made with ❤️ to support every child’s journey.</p>
      </div>
    </footer>
  );
};

export default Footer;

import Link from "next/link";

export default ({ currentUser }) => {
  const links = [
    !currentUser && {
      label: "Sign Up",
      href: "/auth/signup",
    },
    !currentUser && {
      label: "Sign In",
      href: "/auth/signin",
    },
    currentUser && {
      label: "Sell Tickets",
      href: "/tickets/new",
    },
    currentUser && {
      label: "My Orders",
      href: "/orders",
    },
    currentUser && {
      label: "Sign Out",
      href: "/auth/signout",
    },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item" style={{ marginLeft: "20px" }}>
          <Link
            href={href}
            style={{
              textDecoration: "none",
              color: "#007bff",
              fontWeight: "500",
            }}
          >
            {label}
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link
        className="navbar-brand"
        href="/"
        style={{ textDecoration: "none" }}
      >
        GitTix
      </Link>

      <div className="d-flex justify-content-end">
        <ul
          className="nav d-flex align-items-center"
          style={{ listStyle: "none", margin: 0, padding: 0 }}
        >
          {links}
        </ul>
      </div>
    </nav>
  );
};

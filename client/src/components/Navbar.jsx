import { IconButton } from "@mui/material";
import {
  Search,
  Person,
  Menu,
  KeyboardArrowDown,
  Home as HomeIcon,
} from "@mui/icons-material";
import variables from "../styles/variables.scss";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../styles/Navbar.scss";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { setLogout } from "../redux/state";

const Navbar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const renderNavLink = (to, label, isIcon = false) => (
    <Link to={to} className="navbar_link">
      {isIcon ? <HomeIcon sx={{ fontSize: 20 }} /> : label}
      {!isIcon && location.pathname !== to && (
        <KeyboardArrowDown className="nav-arrow" />
      )}
    </Link>
  );

  return (
    <div className="navbar">
      {/* Logo */}
      <a href="/">
        <img src="/assets/logo.png" alt="logo" />
      </a>

      {/* Search Bar */}
      <div className="navbar_search">
        <input
          type="text"
          placeholder="Search ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <IconButton
          disabled={search === ""}
          onClick={() => {
            navigate(`/properties/search/${search}`);
          }}
        >
          <Search sx={{ color: variables.pinkred }} />
        </IconButton>
      </div>

      {/* Navigation Links */}
      <div className="navbar_links">
        {renderNavLink("/", "", true)} {/* Home Icon */}
        {user && (
          <>
            {renderNavLink(`/${user._id}/reservations`, "Reservation List")}
            {renderNavLink(`/${user._id}/trips`, "Trip List")}
            {renderNavLink(`/${user._id}/properties`, "Property List")}
            {renderNavLink(`/${user._id}/wishList`, "Wish List")}  
          </>
        )}
        {renderNavLink("/search", "Search Property")}
        {renderNavLink("/prediction", "Predict Price")}
      </div>

      {/* Right Section */}
      <div className="navbar_right">
        <a href={user ? "/create-listing" : "/login"} className="host">
          Become A Host
        </a>

        <button
          className="navbar_right_account"
          onClick={() => setDropdownMenu(!dropdownMenu)}
        >
          <Menu sx={{ color: variables.darkgrey }} />
          {!user ? (
            <Person sx={{ color: variables.darkgrey }} />
          ) : (
            <img
              src={`http://localhost:5001/${user.profileImagePath.replace(
                "public",
                ""
              )}`}
              alt="profile"
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
          )}
        </button>

        {dropdownMenu && !user && (
          <div className="navbar_right_accountmenu">
            <Link to="/login">Log In</Link>
            <Link to="/register">Sign Up</Link>
          </div>
        )}

        {dropdownMenu && user && (
          <div className="navbar_right_accountmenu">
            <Link to="/create-listing">Become A Host</Link>
            <Link
              to="/login"
              onClick={() => {
                dispatch(setLogout());
              }}
            >
              Log Out
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;



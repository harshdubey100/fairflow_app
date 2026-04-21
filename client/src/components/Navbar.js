import React from 'react';
import { useClerk } from '@clerk/clerk-react';
import { useAuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { signOut } = useClerk();
  const { dbUser } = useAuthContext();

  return (
    <nav className="navbar">
      <div className="navbar-brand">✨ FairFlow</div>
      <div className="navbar-right">
        {dbUser && (
          <span className="navbar-user">
            {dbUser.name} &nbsp;
            <span className={`badge badge-${dbUser.role.toLowerCase()}-role`}>
              {dbUser.role}
            </span>
          </span>
        )}
        <button className="btn-secondary" onClick={() => signOut()}>
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

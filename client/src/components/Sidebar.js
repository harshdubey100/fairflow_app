import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import './Sidebar.css';

const employeeLinks = [
  { to: '/employee/dashboard', label: '🏠 Dashboard' },
  { to: '/employee/tickets', label: '🎫 My Tickets' },
];

const adminLinks = [
  { to: '/admin/dashboard', label: '🏠 Dashboard' },
  { to: '/admin/tickets', label: '📋 All Tickets' },
  { to: '/admin/create-ticket', label: '➕ Create Ticket' },
  { to: '/admin/performance', label: '📊 Performance' },
];

const Sidebar = () => {
  const { dbUser } = useAuthContext();
  const links = dbUser?.role === 'ADMIN' || dbUser?.role === 'HR'
    ? adminLinks
    : employeeLinks;

  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                'sidebar-link' + (isActive ? ' sidebar-link-active' : '')
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;

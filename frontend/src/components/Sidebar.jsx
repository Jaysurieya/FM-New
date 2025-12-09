"use client";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";
import "../css/sidebar.css";

const SidebarContext = createContext(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({ children, open: openProp, setOpen: setOpenProp, animate = true }) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({ children, open, setOpen, animate }) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <div className="md:hidden">
        <MobileSidebar {...props} />
      </div>
    </>
  );
};

export const DesktopSidebar = ({ className, children, ...props }) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={`desktop-sidebar ${className || ""}`}
      animate={{ 
        width: animate ? (open ? "300px" : "60px") : "300px" 
      }}
      transition={{
        duration: 0.2, // Faster duration
        ease: "easeOut", // Smoother easing
        type: "tween" // Use tween instead of spring for more predictable animation
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({ className, children, ...props }) => {
  const { open, setOpen } = useSidebar();
  return (
    <div className={`mobile-sidebar-container`} {...props}>
      <div className="mobile-menu-icon-wrapper">
        <IconMenu2 className="sidebar-icon" onClick={() => setOpen(!open)} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`mobile-overlay ${className || ""}`}
          >
            <div className="mobile-close-icon-wrapper" onClick={() => setOpen(!open)}>
              <IconX />
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SidebarLink = ({ link, className, ...props }) => {
  const { open, animate } = useSidebar();
  return (
    <a href={link.href} className={`sidebar-link ${className || ""}`} {...props}>
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        transition={{
          duration: 0.15, // Faster text transition
          ease: "easeOut"
        }}
        className="sidebar-link-label"
      >
        {link.label}
      </motion.span>
    </a>
  );
};
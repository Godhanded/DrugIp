"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button"
import { IoWalletSharp } from "react-icons/io5"


export default function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const genericHamburgerLine = `h-[3px] w-8 my-1 bg-[#ffffff] transition ease transform duration-300`;
  const genericHamburgerLine1 = `h-[3px] w-6 my-1 bg-[#ffffff] transition ease transform duration-300`;
  const genericHamburgerLine2= `h-[3px] w-4 my-1 bg-[#ffffff] transition ease transform duration-300`;


  const handleLinkClick = () => {
    setOpen(false);
  };

  const navLinks = [
    {
      name: "DAO",
      href: "#dao",
    },
    {
      name: "Github",
      href: "#github",
    },
    {
      name: "About",
      href: "#about",
    },
    {
      name: "How it works",
      href: "#howitworks",
    },
  ];

  // Animation variants for the menu
  const menuVariants = {
    initial: {
      opacity: 0,
      scale: 1.5, // Start larger than normal
      transformOrigin: "top center",
    },
    animate: {
      opacity: 1,
      scale: 1, // Zoom out to normal size
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1], // Custom easing for a nice zoom effect
      },
    },
    exit: {
      opacity: 0,
      scale: 1.5,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  // Animation variants for the links
  const linkVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 + index * 0.1,
        duration: 0.4,
      },
    }),
    exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
  };

  return (
    <div>
      <button
        aria-label="Toggle navigation"
        className="group flex h-8 w-12 flex-col "
        onClick={() => setOpen(!open)}
      >
        <div
          className={`${genericHamburgerLine} ${
            open
              ? "bg-[#328FC2]"
              : "bg-white"
          }`}
        />
        <div
          className={`${genericHamburgerLine1} ${
            open ? "bg-[#328FC2]" : "bg-white"
          }`}
        />
        <div
          className={`${genericHamburgerLine2} ${
            open
              ? "bg-[#328FC2]"
              : "bg-white"
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
        <motion.div
        className="absolute left-1/2 -translate-x-1/2 z-[9999] mt-[1rem] w-full h-screen bg-[#0A1022] py-10 text-center font-[500]"
        initial="initial"
        animate="animate"
        exit="exit"
      >      
            <div className="h-[50vh]">
                <div className="grid gap-5 h-full items-center justify-center">
                    {navLinks.map(({ name, href}, index) => (
                      <motion.div
                        key={name}
                        variants={linkVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        custom={index}
                      >
                        <Link href={href} onClick={handleLinkClick}>
                          <span className="text-base text-center text-white hover:text-white/80 transition-colors block py-2 px-4">
                            {name}
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                    
                    <Button  className="uppercase text-white gap-2 bg-transparent border-[1px] border-white p-1 rounded-none">
                        <span className="font-semibold font-barlow tracking-tight">connect wallet</span>
                        <IoWalletSharp/>
                    </Button>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

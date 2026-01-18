import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Scissors, User, LogOut, CalendarCheck, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDescopeAuth } from "@/hooks/useDescope";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "Services", href: "services" },
  { label: "How It Works", href: "how-it-works" },
  { label: "Reviews", href: "reviews" },
  { label: "FAQ", href: "faq" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useDescopeAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await logout();
    localStorage.removeItem('descope_user');
    navigate('/');
  };

  const scrollToSection = (sectionId: string) => {
    // Close mobile menu first
    setIsOpen(false);
    
    // Check if we're on the home page
    const isOnHomePage = location.pathname === '/home' || location.pathname === '/';
    
    // Use a timeout to allow menu close animation to complete
    setTimeout(() => {
      if (isOnHomePage) {
        // Already on home page, scroll to element
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        // Navigate to home page first, then scroll
        navigate('/home');
        // Wait for navigation to complete, then scroll
        setTimeout(() => {
          const targetElement = document.getElementById(sectionId);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 200);
      }
    }, 350); // Wait for menu animation to complete
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/home" className="flex items-center gap-2 group">
            <div className="relative">
              <Scissors className="w-8 h-8 text-primary transition-transform duration-300 group-hover:rotate-45" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              Mr<span className="text-primary">Finisher</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <User className="w-5 h-5" />
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="w-4 h-4 mr-2" />
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/bookings')}>
                      <CalendarCheck className="w-4 h-4 mr-2" />
                      My Bookings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button variant="gold" size="lg" onClick={() => navigate('/booking')}>
               Book Now
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-card border-t border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => scrollToSection(link.href)}
                  className="block w-full text-left text-lg text-foreground hover:text-primary transition-colors py-2"
                >
                  {link.label}
                </motion.button>
              ))}
              
              {isAuthenticated ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 text-lg text-foreground hover:text-primary py-2 w-full"
                    >
                      <User className="w-5 h-5" />
                      My Profile
                    </button>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <button
                      onClick={() => {
                        navigate('/bookings');
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 text-lg text-foreground hover:text-primary py-2 w-full"
                    >
                      <CalendarCheck className="w-5 h-5" />
                      My Bookings
                    </button>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    variant="gold"
                    size="lg"
                    className="w-full mt-4"
                    onClick={() => {
                      navigate('/auth');
                      setIsOpen(false);
                    }}
                  >
                    Login / Sign Up
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

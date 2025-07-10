import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Menu, X } from "lucide-react";
import NotificationCenter from "./NotificationCenter";
import HeaderLogo from "./header/HeaderLogo";
import DesktopNavigation from "./header/DesktopNavigation";
import MobileNavigation from "./header/MobileNavigation";
import UserMenu from "./header/UserMenu";

interface HeaderProps {
  onShowAdminPanel?: () => void;
}

const Header = ({ onShowAdminPanel }: HeaderProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showTasksDropdown, setShowTasksDropdown] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between">
          {/* Logo */}
          <HeaderLogo />

          {/* Desktop Navigation */}
          <DesktopNavigation 
            onShowAdminPanel={onShowAdminPanel}
            showTasksDropdown={showTasksDropdown}
            setShowTasksDropdown={setShowTasksDropdown}
          />

          {/* User Actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Mobile Navigation Toggle */}
            <div className="lg:hidden">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm"
              className="relative p-2"
              onClick={() => setShowNotifications(true)}
            >
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <UserMenu onShowAdminPanel={onShowAdminPanel} />
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <MobileNavigation 
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
          onShowAdminPanel={onShowAdminPanel}
        />
      </header>

      {/* Notification Center */}
      {showNotifications && (
        <NotificationCenter onClose={() => setShowNotifications(false)} />
      )}
    </>
  );
};

export default Header;

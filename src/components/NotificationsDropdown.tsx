import { Bell, CheckCircle2, MessageSquare, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "../utils/cn";

export interface AppNotification {
  id: string;
  message: string;
  date: string;
  read: boolean;
  type: "post" | "feedback" | "system";
}

interface NotificationsDropdownProps {
  notifications: AppNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllRead: () => void;
  onToggleOpen: () => void;
}

export function NotificationsDropdown({
  notifications,
  isOpen,
  onClose,
  onMarkAllRead,
  onToggleOpen
}: NotificationsDropdownProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button 
        onClick={onToggleOpen}
        className="p-2 hover:bg-white/5 rounded-full transition-colors relative"
      >
        <Bell className={cn("w-5 h-5 transition-colors", isOpen ? "text-emerald-400" : "text-zinc-400")} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-zinc-900" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/5 bg-zinc-900/50">
                <h3 className="text-sm font-medium text-zinc-100">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllRead}
                    className="text-[10px] font-semibold uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500 text-sm">
                    No new notifications
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-4 border-b border-white/5 last:border-0 transition-colors flex gap-3",
                          !notification.read ? "bg-white/[0.02]" : "opacity-75"
                        )}
                      >
                        <div className="mt-0.5 shrink-0">
                          {notification.type === "post" && <Sparkles className="w-4 h-4 text-emerald-400" />}
                          {notification.type === "feedback" && <MessageSquare className="w-4 h-4 text-emerald-400" />}
                          {notification.type === "system" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm text-zinc-200", !notification.read && "font-medium")}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-zinc-500 mt-1">
                            {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

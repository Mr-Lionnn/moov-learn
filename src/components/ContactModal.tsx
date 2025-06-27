
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Phone, Mail, MessageCircle } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: {
    id: number;
    name: string;
    role: string;
    department: string;
    avatar: string;
    status: string;
  };
}

const ContactModal = ({ isOpen, onClose, member }: ContactModalProps) => {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log(`Message sent to ${member.name}:`, { subject, message });
      // Here you would typically send the message to your backend
      setMessage("");
      setSubject("");
      onClose();
      // Show success notification
      alert(`Message envoyé à ${member.name}!`);
    }
  };

  const handleCall = () => {
    console.log(`Calling ${member.name}`);
    alert(`Appel en cours vers ${member.name}...`);
  };

  const handleEmail = () => {
    const mailtoLink = `mailto:${member.name.toLowerCase().replace(' ', '.')}@company.com?subject=${encodeURIComponent(subject)}`;
    window.location.href = mailtoLink;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En ligne":
        return "bg-green-500";
      case "Occupé":
        return "bg-yellow-500";
      case "Absent":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contacter</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.avatar} />
                <AvatarFallback>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
            </div>
            <div>
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-sm text-gray-600">{member.role}</p>
              <Badge variant="outline" className="text-xs">{member.department}</Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Sujet</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Objet du message..."
              />
            </div>
            
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tapez votre message..."
                rows={4}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSendMessage} disabled={!message.trim()} className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Envoyer
            </Button>
            <Button variant="outline" onClick={handleCall}>
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleEmail}>
              <Mail className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;

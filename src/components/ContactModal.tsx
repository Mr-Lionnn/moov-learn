
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Phone, Mail, MessageCircle, AlertTriangle } from "lucide-react";
import { textSchema, sanitizeText, generateCSRFToken } from "@/utils/security";
import { useToast } from "@/hooks/use-toast";

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
  const [errors, setErrors] = useState<{ subject?: string; message?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Return null if member is not provided
  if (!member) {
    return null;
  }

  const handleSendMessage = async () => {
    setIsLoading(true);
    setErrors({});

    // Validate inputs
    const subjectValidation = textSchema.safeParse(subject);
    const messageValidation = textSchema.safeParse(message);

    if (!subjectValidation.success || !messageValidation.success || !message.trim()) {
      setErrors({
        subject: subjectValidation.error?.issues[0]?.message || (!subject.trim() ? "Sujet requis" : undefined),
        message: messageValidation.error?.issues[0]?.message || (!message.trim() ? "Message requis" : undefined)
      });
      setIsLoading(false);
      return;
    }

    try {
      // Sanitize inputs
      const sanitizedSubject = sanitizeText(subject);
      const sanitizedMessage = sanitizeText(message);
      
      console.log(`Message sent to ${member.name}:`, { 
        subject: sanitizedSubject, 
        message: sanitizedMessage,
        timestamp: new Date().toISOString()
      });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically send the message to your backend
      setMessage("");
      setSubject("");
      setErrors({});
      onClose();
      
      toast({
        title: "Message envoyé",
        description: `Votre message a été envoyé à ${member.name}`,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
          <DialogDescription>
            Envoyez un message à ce membre de l'équipe
          </DialogDescription>
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

          <form className="space-y-4">
            <input type="hidden" name="csrf_token" value={generateCSRFToken()} />
            
            <div>
              <Label htmlFor="subject">Sujet</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Objet du message..."
                className={errors.subject ? "border-red-500" : ""}
                disabled={isLoading}
                maxLength={100}
              />
              {errors.subject && (
                <p className="text-sm text-red-600 mt-1">{errors.subject}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tapez votre message..."
                rows={4}
                className={errors.message ? "border-red-500" : ""}
                disabled={isLoading}
                maxLength={1000}
              />
              {errors.message && (
                <p className="text-sm text-red-600 mt-1">{errors.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">{message.length}/1000 caractères</p>
            </div>
          </form>

          <div className="flex gap-2">
            <Button 
              onClick={handleSendMessage} 
              disabled={!message.trim() || !subject.trim() || isLoading} 
              className="flex-1"
            >
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? "Envoi..." : "Envoyer"}
            </Button>
            <Button variant="outline" onClick={handleCall} disabled={isLoading}>
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleEmail} disabled={isLoading}>
              <Mail className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;

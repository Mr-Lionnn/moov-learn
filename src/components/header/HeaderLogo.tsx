import { Network } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeaderLogo = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => navigate("/")}>
      <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg">
        <Network className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
      </div>
      <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 hidden xs:block">MoovLearn</h1>
    </div>
  );
};

export default HeaderLogo;
'use client';
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const LoadingOverlay = () => {
    const isLoading = useSelector((state: RootState) => state.loading.isLoading);

    if (!isLoading) {
        return null;
    }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

export default LoadingOverlay;
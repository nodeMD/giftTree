import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { useState } from "react";

export function useDeleteAccount() {
  const { deleteAccount, user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const open = () => setShowModal(true);

  const close = () => {
    setShowModal(false);
    setNicknameInput("");
    setError("");
  };

  const handleNicknameChange = (text: string) => {
    setNicknameInput(text);
    if (error) setError("");
  };

  const confirmDelete = async () => {
    if (nicknameInput !== user?.nickname) {
      setError("Nickname doesn't match. Please try again.");
      return;
    }

    setError("");
    setIsDeleting(true);
    try {
      await deleteAccount();
      router.replace("/(auth)/login");
    } catch (err) {
      console.error("Error deleting account:", err);
      setError("Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
      close();
    }
  };

  return {
    showModal,
    open,
    close,
    nicknameInput,
    handleNicknameChange,
    isDeleting,
    error,
    confirmDelete,
    userNickname: user?.nickname,
  };
}

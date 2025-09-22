
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FaUpload, FaSpinner } from 'react-icons/fa'

interface GroupAvatarUploadProps {
  onUpload: (url: string) => void;
  existingAvatarUrl?: string | null;
}

export default function GroupAvatarUpload({ onUpload, existingAvatarUrl }: GroupAvatarUploadProps) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(existingAvatarUrl || null);

  useEffect(() => {
    if (existingAvatarUrl) {
      setAvatarUrl(existingAvatarUrl);
    }
  }, [existingAvatarUrl]);

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Vous devez sélectionner une image à télécharger.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('group-avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('group-avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      onUpload(publicUrl);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar du groupe" className="w-full h-full object-cover" />
        ) : (
          <span className="text-muted-foreground">Avatar</span>
        )}
      </div>
      <div>
        <label htmlFor="group-avatar-upload" className="cursor-pointer bg-muted hover:bg-muted/80 text-muted-foreground font-bold py-2 px-4 rounded-lg inline-flex items-center">
          {uploading ? <FaSpinner className="animate-spin mr-2" /> : <FaUpload className="mr-2" />}
          <span>{uploading ? 'Chargement...' : 'Choisir une image'}</span>
        </label>
        <input
          id="group-avatar-upload"
          type="file"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          className="hidden"
        />
      </div>
    </div>
  );
}

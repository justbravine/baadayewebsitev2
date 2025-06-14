import { useRef, useState, ChangeEvent, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface FileUploadProps {
  label: string;
  accept?: string;
  onFileSelect: (file: File | null) => void;
  error?: string;
  className?: string;
  maxSizeMB?: number;
  previewType?: 'image' | 'document';
}

const FileUpload = ({
  label,
  accept = 'image/*',
  onFileSelect,
  error,
  className = '',
  maxSizeMB = 5,
  previewType = 'image',
}: FileUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`File size must be less than ${maxSizeMB}MB`);
        return;
      }
      
      setFileName(file.name);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
      
      onFileSelect(file);
    }
  }, [maxSizeMB, onFileSelect]);

  const handleRemove = useCallback(() => {
    setPreview(null);
    setFileName(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileSelect]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`${className}`}>
      <label className={`block text-sm font-medium mb-2 ${error ? 'text-red-600' : 'text-gray-700'}`}>
        {label}
      </label>
      
      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      
      <AnimatePresence mode="wait">
        {!preview && !fileName ? (
          <motion.div
            key="upload-area"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onClick={handleClick}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400 bg-white/70 backdrop-blur-sm'
            }`}
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <Upload className={`h-8 w-8 ${error ? 'text-red-400' : 'text-blue-400'}`} />
              <div className="text-sm">
                <span className="font-medium text-blue-600 hover:text-blue-700">Click to upload</span> or drag and drop
              </div>
              <p className="text-xs text-gray-500">
                {previewType === 'image' 
                  ? 'PNG, JPG up to 5MB' 
                  : 'PDF, DOC, DOCX up to 5MB'}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative group"
          >
            {previewType === 'image' && preview ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200">
                <Image 
                  src={preview} 
                  alt="Preview" 
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-md hover:bg-red-50 text-red-500 transition-colors"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between bg-white/70 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <ImageIcon className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 truncate max-w-xs">{fileName}</p>
                    <p className="text-xs text-gray-500">
                      {Math.round((fileInputRef.current?.files?.[0]?.size || 0) / 1024)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remove file"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-xs text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default FileUpload;

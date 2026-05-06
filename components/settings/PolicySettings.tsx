"use client";

import { useState, useEffect, useRef } from "react";
import { useGetPolicyQuery, useUpdatePolicyMutation } from "@/lib/features/policy/policyApi";
import { Save, Bold, Italic, Underline, Heading1, Heading2, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link2, Code } from "lucide-react";
import Swal from "sweetalert2";

export default function PolicySettings({ onSaveComplete }: { onSaveComplete?: () => void }) {
    const { data: policyData, isLoading, refetch } = useGetPolicyQuery();
    // const [createPolicy, { isLoading: isCreating }] = useCreatePolicyMutation();
    const [updatePolicy, { isLoading: isUpdating }] = useUpdatePolicyMutation();
    const [content, setContent] = useState("");
    const [isPlainText, setIsPlainText] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (policyData?.data?.content || policyData?.content) {
            const fetchedContent = policyData.data?.content || policyData.content;
            setContent(fetchedContent);
            if (editorRef.current && editorRef.current.innerHTML !== fetchedContent) {
                editorRef.current.innerHTML = fetchedContent;
            }
        }
    }, [policyData]);

    const handleFormat = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            setContent(editorRef.current.innerHTML);
        }
    };

    const handleLink = () => {
        const url = prompt("Enter the URL:");
        if (url) {
            handleFormat("createLink", url);
        }
    };

    const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
        setContent(e.currentTarget.innerHTML);
    };

    const handleSave = async () => {
        try {
            await updatePolicy({ content }).unwrap();
            Swal.fire({
                icon: "success",
                title: "Updated!",
                text: "Privacy policy updated successfully.",
                timer: 1500,
                showConfirmButton: false,
            });
            refetch();
            if (onSaveComplete) onSaveComplete();
        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.data?.message || "Failed to update privacy policy",
            });
        }
    };


    // const handleCreatePolicy = async () => {
    //     try {
    //         await createPolicy({ content }).unwrap();
    //         Swal.fire({
    //             icon: "success",
    //             title: "Created!",
    //             text: "Privacy policy created successfully.",
    //             timer: 1500,
    //             showConfirmButton: false,
    //         });
    //         refetch();
    //         if (onSaveComplete) onSaveComplete();
    //     } catch (error: any) {
    //         Swal.fire({
    //             icon: "error",
    //             title: "Error",
    //             text: error?.data?.message || "Failed to create privacy policy",
    //         });
    //     }
    // };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
            <div className="flex flex-col gap-4">
                {/* Header (Optional based on where it's used, but kept for save button alignment) */}
                <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-medium text-slate-900">Privacy Policy Editor</h3>
                    <button 
                        onClick={() => setIsPlainText(!isPlainText)}
                        className={`flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-1.5 rounded-md ${
                            isPlainText ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        <Code size={16} />
                        <span>{isPlainText ? "Rich Text" : "Plain Text"}</span>
                    </button>
                </div>

                {/* Toolbar */}
                <div className={`flex items-center flex-wrap gap-1 border border-slate-200 rounded-md p-1.5 px-3 transition-opacity ${
                    isPlainText ? "opacity-50 pointer-events-none bg-slate-50" : "bg-white"
                }`}>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('bold')} className="p-1.5 text-slate-700 hover:bg-slate-100 rounded transition-colors" title="Bold">
                        <Bold size={18} />
                    </button>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('italic')} className="p-1.5 text-slate-700 hover:bg-slate-100 rounded transition-colors" title="Italic">
                        <Italic size={18} />
                    </button>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('underline')} className="p-1.5 text-slate-700 hover:bg-slate-100 rounded transition-colors" title="Underline">
                        <Underline size={18} />
                    </button>
                    
                    <div className="w-px h-5 bg-slate-200 mx-2" />
                    
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('formatBlock', 'H1')} className="p-1.5 text-slate-700 hover:bg-slate-100 rounded transition-colors" title="Heading 1">
                        <Heading1 size={18} />
                    </button>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('formatBlock', 'H2')} className="p-1.5 text-slate-700 hover:bg-slate-100 rounded transition-colors" title="Heading 2">
                        <Heading2 size={18} />
                    </button>

                    <div className="w-px h-5 bg-slate-200 mx-2" />

                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('insertUnorderedList')} className="p-1.5 text-slate-700 hover:bg-slate-100 rounded transition-colors" title="Bullet List">
                        <List size={18} />
                    </button>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('insertOrderedList')} className="p-1.5 text-slate-700 hover:bg-slate-100 rounded transition-colors" title="Numbered List">
                        <ListOrdered size={18} />
                    </button>

                    <div className="w-px h-5 bg-slate-200 mx-2" />

                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('justifyLeft')} className="p-1.5 text-slate-700 hover:bg-slate-100 rounded transition-colors" title="Align Left">
                        <AlignLeft size={18} />
                    </button>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('justifyCenter')} className="p-1.5 text-slate-700 hover:bg-slate-100 rounded transition-colors" title="Align Center">
                        <AlignCenter size={18} />
                    </button>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('justifyRight')} className="p-1.5 text-slate-700 hover:bg-slate-100 rounded transition-colors" title="Align Right">
                        <AlignRight size={18} />
                    </button>

                    <div className="w-px h-5 bg-slate-200 mx-2" />

                    <button onMouseDown={(e) => e.preventDefault()} onClick={handleLink} className="p-1.5 text-slate-700 hover:bg-slate-100 rounded transition-colors" title="Link">
                        <Link2 size={18} />
                    </button>
                </div>

                {/* Editor Area */}
                <div className="w-full relative">
                    {isPlainText ? (
                        <textarea
                            value={content}
                            onChange={(e) => {
                                setContent(e.target.value);
                                if (editorRef.current) editorRef.current.innerHTML = e.target.value;
                            }}
                            placeholder="Write your HTML or plain text here..."
                            className="w-full min-h-[350px] p-6 outline-none resize-y text-slate-600 font-mono text-sm leading-relaxed bg-slate-800 text-slate-300 rounded-md border border-transparent focus:border-slate-500 transition-colors"
                        />
                    ) : (
                        <div
                            ref={editorRef}
                            contentEditable
                            onInput={handleEditorInput}
                            className="w-full min-h-[350px] p-6 outline-none text-slate-700 text-[15px] leading-relaxed bg-[#f1f5f9] rounded-md border border-transparent focus:border-blue-200 transition-colors prose prose-sm max-w-none"
                            style={{ minHeight: '350px' }}
                            // placeholder="Describe the privacy policy in detail..."
                        />
                    )}
                </div>
                
                <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-500">Last updated: {policyData?.data?.updatedAt || policyData?.updatedAt ? new Date(policyData?.data?.updatedAt || policyData?.updatedAt).toLocaleDateString() : "Never"}</span>
                    <button
                        onClick={handleSave}
                        disabled={isUpdating || isLoading }
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm font-medium text-sm"
                    >
                        {isUpdating  ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                            <Save size={16} />
                        )}
                        <span>Save Policy</span>
                    </button>
                </div>
            </div>
    );
}

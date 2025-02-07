// src/components/LearningInterface.js

import React, { useState } from "react";
import {
  Search,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import { lessons as chapter1Lessons } from "../data/lessons/chapter1";
import { lessons as chapter2Lessons } from "../data/lessons/chapter2";
import { lessons as chapter3Lessons } from "../data/lessons/chapter3";
import { lessons as chapter4Lessons } from "../data/lessons/chapter4";
import { lessons as chapter5Lessons } from "../data/lessons/chapter5";
import { lessons as chapter6Lessons } from "../data/lessons/chapter6";
import { lessons as chapter7Lessons } from "../data/lessons/chapter7";
import { lessons as chapter8Lessons } from "../data/lessons/chapter8";
import { chapters } from "../data/chapters";

const LearningInterface = () => {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [expandedChapters, setExpandedChapters] = useState(new Set());

  const allLessons = [
    ...chapter1Lessons,
    ...chapter2Lessons,
    ...chapter3Lessons,
    ...chapter4Lessons,
    ...chapter5Lessons,
    ...chapter6Lessons,
    ...chapter7Lessons,
    ...chapter8Lessons,
  ];

  const filteredLessons = allLessons.filter(
    (lesson) =>
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // HTMLコンテンツを安全に表示するための関数
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  // コードブロックのフォーマット関数
  const formatCode = (content) => {
    if (!content) return "";

    return content.replace(
      /<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/g,
      (match, code) => {
        // 余分な空白を削除し、適切なインデントを保持
        const formattedCode = code
          .trim()
          .split("\n")
          .map((line) => line.trimStart())
          .join("\n");

        return `<pre><code>${formattedCode}</code></pre>`;
      }
    );
  };

  // ホームに戻る関数
  const goToHome = () => {
    setCurrentLesson(0);
    setSearchQuery("");
    setExpandedChapters(new Set());
  };

  const markAsComplete = (id) => {
    setCompletedLessons((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const toggleChapter = (chapterId) => {
    setExpandedChapters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  const getLessonsByChapter = (chapterId) => {
    return filteredLessons.filter((lesson) =>
      lesson.chapter.startsWith(`第${chapterId}章`)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex justify-between items-center">
            <button
              onClick={goToHome}
              className="text-xl font-bold text-gray-800 flex items-center gap-2 hover:text-primary-600 transition-colors duration-200 cursor-pointer"
            >
              <BookOpen className="text-primary-600" />
              Web開発学習ガイド
            </button>
            <div className="flex items-center gap-6">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="レッスンを検索..."
                  className="input-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="text-sm text-gray-600 font-medium">
                進捗: {completedLessons.size}/{allLessons.length} 完了
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 flex gap-6">
        {/* サイドバー */}
        <div className="w-80 flex-shrink-0">
          <div className="card sticky top-24">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-primary-600" />
              レッスン一覧
            </h3>
            <div className="space-y-2">
              {chapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleChapter(chapter.id)}
                    className="w-full p-3 bg-gray-50 text-left flex items-center justify-between hover:bg-gray-100"
                  >
                    <span className="font-medium">
                      第{chapter.id}章: {chapter.title}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transform transition-transform ${
                        expandedChapters.has(chapter.id) ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedChapters.has(chapter.id) && (
                    <div className="divide-y">
                      {getLessonsByChapter(chapter.id).map((lesson, index) => (
                        <button
                          key={lesson.id}
                          onClick={() =>
                            setCurrentLesson(allLessons.indexOf(lesson))
                          }
                          className={`w-full p-3 pl-6 text-left flex items-center justify-between hover:bg-gray-50 ${
                            currentLesson === allLessons.indexOf(lesson)
                              ? "bg-primary-50 text-primary-700"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {completedLessons.has(lesson.id) && (
                              <CheckCircle
                                size={16}
                                className="text-green-500"
                              />
                            )}
                            <span className="text-sm">{lesson.title}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-grow">
          <div className="card">
            <div className="space-y-6">
              <div className="pb-6 border-b border-gray-100">
                <div className="text-sm text-primary-600 font-medium mb-2">
                  {filteredLessons[currentLesson]?.chapter}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredLessons[currentLesson]?.title}
                </h2>
              </div>

              <div
                className="prose max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={createMarkup(
                  formatCode(filteredLessons[currentLesson]?.content)
                )}
              />

              <div className="flex justify-between items-center pt-6 border-t">
                <button
                  onClick={() =>
                    currentLesson > 0 && setCurrentLesson((curr) => curr - 1)
                  }
                  disabled={currentLesson === 0}
                  className="btn-secondary"
                >
                  <ChevronLeft size={16} />
                  前へ
                </button>

                <button
                  onClick={() =>
                    markAsComplete(filteredLessons[currentLesson].id)
                  }
                  className="btn-mark"
                >
                  <CheckCircle size={16} />
                  完了としてマーク
                </button>

                <button
                  onClick={() =>
                    currentLesson < filteredLessons.length - 1 &&
                    setCurrentLesson((curr) => curr + 1)
                  }
                  disabled={currentLesson === filteredLessons.length - 1}
                  className="btn-primary"
                >
                  次へ
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningInterface;

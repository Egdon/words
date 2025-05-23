// 全局变量
let currentWordIndex = 0;
let currentWrongIndex = 0; // 当前错题索引
let currentTestIndex = 0;
let testWords = [];
let wrongWords = []; // 存储错题索引
let isStudyingWrong = false; // 是否在学习错题模式
let userSettings = {
    dailyGoal: 20,
    reviewFrequency: 2,
    testMode: 'en-to-zh',
    autoAudio: false
};

// DOM 元素
document.addEventListener('DOMContentLoaded', function() {
    // 导航按钮
    const homeBtn = document.getElementById('home-btn');
    const testBtn = document.getElementById('test-btn');
    const wrongBtn = document.getElementById('wrong-btn');
    const wrongStudyBtn = document.getElementById('wrong-study-btn');
    const progressBtn = document.getElementById('progress-btn');
    const settingsBtn = document.getElementById('settings-btn');
    
    // 部分
    const homeSection = document.getElementById('home-section');
    const testSection = document.getElementById('test-section');
    const wrongSection = document.getElementById('wrong-section');
    const wrongStudySection = document.getElementById('wrong-study-section');
    const progressSection = document.getElementById('progress-section');
    const settingsSection = document.getElementById('settings-section');
    
    // 闪卡元素
    const flashcard = document.getElementById('flashcard');
    const wordText = document.getElementById('word-text');
    const definitionText = document.getElementById('definition-text');
    const playAudioBtn = document.getElementById('play-audio');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const randomBtn = document.getElementById('random-btn');
    
    // 错题学习闪卡元素
    const wrongFlashcard = document.getElementById('wrong-flashcard');
    const wrongWordText = document.getElementById('wrong-word-text');
    const wrongDefinitionText = document.getElementById('wrong-definition-text');
    const wrongPlayAudioBtn = document.getElementById('wrong-play-audio');
    const wrongPrevBtn = document.getElementById('wrong-prev-btn');
    const wrongNextBtn = document.getElementById('wrong-next-btn');
    const wrongRandomBtn = document.getElementById('wrong-random-btn');
    
    // 难度按钮
    const hardBtn = document.getElementById('hard-btn');
    const mediumBtn = document.getElementById('medium-btn');
    const easyBtn = document.getElementById('easy-btn');
    const unknownBtn = document.getElementById('unknown-btn');
    
    // 错题学习难度按钮
    const wrongHardBtn = document.getElementById('wrong-hard-btn');
    const wrongMediumBtn = document.getElementById('wrong-medium-btn');
    const wrongEasyBtn = document.getElementById('wrong-easy-btn');
    const wrongRemoveBtn = document.getElementById('wrong-remove-btn');
    
    // 测试元素
    const questionText = document.getElementById('question-text');
    const testWord = document.getElementById('test-word');
    const optionsContainer = document.getElementById('options-container');
    const resultContainer = document.getElementById('result-container');
    const resultText = document.getElementById('result-text');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    
    // 错题本元素
    const wrongList = document.getElementById('wrong-list');
    const wrongWordsCount = document.getElementById('wrong-words-count');
    const studyWrongBtn = document.getElementById('study-wrong-btn');
    const clearWrongBtn = document.getElementById('clear-wrong-btn');
    
    // 进度元素
    const totalWordsEl = document.getElementById('total-words');
    const learnedWordsEl = document.getElementById('learned-words');
    const masteredWordsEl = document.getElementById('mastered-words');
    const reviewWordsEl = document.getElementById('review-words');
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    const wordList = document.getElementById('word-list');
    
    // 设置元素
    const dailyGoalSelect = document.getElementById('daily-goal');
    const reviewFrequencySelect = document.getElementById('review-frequency');
    const testModeSelect = document.getElementById('test-mode');
    const autoAudioCheck = document.getElementById('auto-audio');
    const resetProgressBtn = document.getElementById('reset-progress-btn');
    
    // 初始化
    loadSettings();
    // 直接显示当前单词和更新进度
    displayCurrentWord();
    updateProgressStats();
    updateWrongWords();
    
    // 添加键盘控制提示到学习界面
    const controlsEl = document.querySelector('.controls');
    const keyboardHints = document.createElement('div');
    keyboardHints.className = 'keyboard-hints';
    keyboardHints.innerHTML = '键盘控制: <span class="keyboard-hint">←</span> 上一个 | <span class="keyboard-hint">→</span> 下一个 | <span class="keyboard-hint">空格</span> 翻转卡片 | <span class="keyboard-hint">1</span> 简单 | <span class="keyboard-hint">2</span> 一般 | <span class="keyboard-hint">3</span> 困难 | <span class="keyboard-hint">R</span> 随机 | <span class="keyboard-hint">U</span> 认不识';
    controlsEl.parentNode.insertBefore(keyboardHints, controlsEl.nextSibling);
    
    // 导航事件监听器
    homeBtn.addEventListener('click', function() {
        showSection(homeSection);
        setActiveNavButton(homeBtn);
    });
    
    testBtn.addEventListener('click', function() {
        showSection(testSection);
        setActiveNavButton(testBtn);
        startTest();
    });
    
    wrongBtn.addEventListener('click', function() {
        showSection(wrongSection);
        setActiveNavButton(wrongBtn);
        updateWrongWords();
    });
    
    wrongStudyBtn.addEventListener('click', function() {
        // 检查是否有错题
        if (wrongWords.length === 0) {
            alert('错题本中没有单词！');
            return;
        }
        
        showSection(wrongStudySection);
        setActiveNavButton(wrongStudyBtn);
        startWrongWordsStudy();
    });
    
    progressBtn.addEventListener('click', function() {
        showSection(progressSection);
        setActiveNavButton(progressBtn);
        updateProgressStats();
        displayWordList('all');
    });
    
    settingsBtn.addEventListener('click', function() {
        showSection(settingsSection);
        setActiveNavButton(settingsBtn);
    });
    
    // 常规学习闪卡事件监听器
    flashcard.addEventListener('click', function() {
        this.classList.toggle('flipped');
    });
    
    playAudioBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // 防止触发卡片翻转
        playWordAudio(vocabularyData[currentWordIndex].word);
    });
    
    prevBtn.addEventListener('click', function() {
        if (currentWordIndex > 0) {
            currentWordIndex--;
            displayCurrentWord();
        }
    });
    
    nextBtn.addEventListener('click', function() {
        if (currentWordIndex < vocabularyData.length - 1) {
            currentWordIndex++;
            displayCurrentWord();
        }
    });
    
    randomBtn.addEventListener('click', function() {
        currentWordIndex = Math.floor(Math.random() * vocabularyData.length);
        displayCurrentWord();
    });
    
    // 错题学习闪卡事件监听器
    wrongFlashcard.addEventListener('click', function() {
        this.classList.toggle('flipped');
    });
    
    wrongPlayAudioBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // 防止触发卡片翻转
        if (wrongWords.length > 0) {
            const wrongWordIndex = wrongWords[currentWrongIndex];
            playWordAudio(vocabularyData[wrongWordIndex].word);
        }
    });
    
    wrongPrevBtn.addEventListener('click', function() {
        navigateToPrevWrongWord();
    });
    
    wrongNextBtn.addEventListener('click', function() {
        navigateToNextWrongWord();
    });
    
    wrongRandomBtn.addEventListener('click', function() {
        if (wrongWords.length > 0) {
            currentWrongIndex = Math.floor(Math.random() * wrongWords.length);
            displayCurrentWrongWord();
        }
    });
    
    // 常规学习难度按钮事件监听器
    hardBtn.addEventListener('click', function() {
        updateWordDifficulty(currentWordIndex, 5);
    });
    
    mediumBtn.addEventListener('click', function() {
        updateWordDifficulty(currentWordIndex, 3);
    });
    
    easyBtn.addEventListener('click', function() {
        updateWordDifficulty(currentWordIndex, 1);
    });
    
    // 认不识按钮事件监听器
    unknownBtn.addEventListener('click', function() {
        addToWrongWords(currentWordIndex);
    });
    
    // 错题学习难度按钮事件监听器
    wrongHardBtn.addEventListener('click', function() {
        if (wrongWords.length > 0) {
            const wrongWordIndex = wrongWords[currentWrongIndex];
            updateWordDifficulty(wrongWordIndex, 5);
            navigateToNextWrongWord();
        }
    });
    
    wrongMediumBtn.addEventListener('click', function() {
        if (wrongWords.length > 0) {
            const wrongWordIndex = wrongWords[currentWrongIndex];
            updateWordDifficulty(wrongWordIndex, 3);
            navigateToNextWrongWord();
        }
    });
    
    wrongEasyBtn.addEventListener('click', function() {
        if (wrongWords.length > 0) {
            const wrongWordIndex = wrongWords[currentWrongIndex];
            updateWordDifficulty(wrongWordIndex, 1);
            navigateToNextWrongWord();
        }
    });
    
    // 移出错题按钮事件监听器
    wrongRemoveBtn.addEventListener('click', function() {
        if (wrongWords.length > 0) {
            const wrongWordIndex = wrongWords[currentWrongIndex];
            removeFromWrongWords(wrongWordIndex);
            
            // 如果没有更多错题，返回错题本界面
            if (wrongWords.length === 0) {
                alert('错题本已清空！返回错题本页面。');
                showSection(wrongSection);
                setActiveNavButton(wrongBtn);
                return;
            }
            
            // 调整currentWrongIndex确保在有效范围内
            if (currentWrongIndex >= wrongWords.length) {
                currentWrongIndex = wrongWords.length - 1;
            }
            
            // 显示下一个错题
            displayCurrentWrongWord();
        }
    });
    
    // 测试事件监听器
    nextQuestionBtn.addEventListener('click', function() {
        currentTestIndex++;
        if (currentTestIndex < testWords.length) {
            displayTestQuestion();
        } else {
            // 测试结束
            optionsContainer.innerHTML = '';
            resultContainer.style.display = 'block';
            resultText.textContent = '测试完成！';
            nextQuestionBtn.textContent = '返回学习';
            nextQuestionBtn.addEventListener('click', function() {
                showSection(homeSection);
                setActiveNavButton(homeBtn);
            }, { once: true });
        }
    });
    
    // 进度页面标签事件监听器
    document.getElementById('all-words-tab').addEventListener('click', function() {
        setActiveWordTab(this);
        displayWordList('all');
    });
    
    document.getElementById('mastered-words-tab').addEventListener('click', function() {
        setActiveWordTab(this);
        displayWordList('mastered');
    });
    
    document.getElementById('learning-words-tab').addEventListener('click', function() {
        setActiveWordTab(this);
        displayWordList('learning');
    });
    
    document.getElementById('review-words-tab').addEventListener('click', function() {
        setActiveWordTab(this);
        displayWordList('review');
    });
    
    // 设置事件监听器
    dailyGoalSelect.addEventListener('change', function() {
        userSettings.dailyGoal = parseInt(this.value);
        saveSettings();
    });
    
    reviewFrequencySelect.addEventListener('change', function() {
        userSettings.reviewFrequency = parseInt(this.value);
        saveSettings();
    });
    
    testModeSelect.addEventListener('change', function() {
        userSettings.testMode = this.value;
        saveSettings();
    });
    
    autoAudioCheck.addEventListener('change', function() {
        userSettings.autoAudio = this.checked;
        saveSettings();
    });
    
    resetProgressBtn.addEventListener('click', function() {
        if (confirm('确定要重置所有学习进度吗？这将无法恢复！')) {
            resetProgress();
        }
    });
    
    // 添加键盘控制 - 常规学习模式
    document.addEventListener('keydown', function(e) {
        // 只在常规学习页面有效
        if (homeSection.classList.contains('active')) {
            switch (e.key) {
                case 'ArrowLeft':
                    if (currentWordIndex > 0) {
                        currentWordIndex--;
                        displayCurrentWord();
                    }
                    break;
                case 'ArrowRight':
                    if (currentWordIndex < vocabularyData.length - 1) {
                        currentWordIndex++;
                        displayCurrentWord();
                    }
                    break;
                case ' ':  // 空格键
                    flashcard.classList.toggle('flipped');
                    e.preventDefault(); // 防止页面滚动
                    break;
                case '1':
                    updateWordDifficulty(currentWordIndex, 1); // 简单
                    break;
                case '2':
                    updateWordDifficulty(currentWordIndex, 3); // 一般
                    break;
                case '3':
                    updateWordDifficulty(currentWordIndex, 5); // 困难
                    break;
                case 'r':
                case 'R':
                    currentWordIndex = Math.floor(Math.random() * vocabularyData.length);
                    displayCurrentWord();
                    break;
                case 'u':
                case 'U':
                    addToWrongWords(currentWordIndex);
                    break;
            }
        }
        // 错题学习页面键盘控制
        else if (wrongStudySection.classList.contains('active') && wrongWords.length > 0) {
            switch (e.key) {
                case 'ArrowLeft':
                    navigateToPrevWrongWord();
                    break;
                case 'ArrowRight':
                    navigateToNextWrongWord();
                    break;
                case ' ':  // 空格键
                    wrongFlashcard.classList.toggle('flipped');
                    e.preventDefault(); // 防止页面滚动
                    break;
                case '1':
                    const easyIndex = wrongWords[currentWrongIndex];
                    updateWordDifficulty(easyIndex, 1); // 简单
                    navigateToNextWrongWord();
                    break;
                case '2':
                    const mediumIndex = wrongWords[currentWrongIndex];
                    updateWordDifficulty(mediumIndex, 3); // 一般
                    navigateToNextWrongWord();
                    break;
                case '3':
                    const hardIndex = wrongWords[currentWrongIndex];
                    updateWordDifficulty(hardIndex, 5); // 困难
                    navigateToNextWrongWord();
                    break;
                case 'r':
                case 'R':
                    currentWrongIndex = Math.floor(Math.random() * wrongWords.length);
                    displayCurrentWrongWord();
                    break;
                case 'd':
                case 'D':
                    const removeIndex = wrongWords[currentWrongIndex];
                    removeFromWrongWords(removeIndex);
                    
                    if (wrongWords.length === 0) {
                        alert('错题本已清空！返回错题本页面。');
                        showSection(wrongSection);
                        setActiveNavButton(wrongBtn);
                        return;
                    }
                    
                    // 调整currentWrongIndex确保在有效范围内
                    if (currentWrongIndex >= wrongWords.length) {
                        currentWrongIndex = wrongWords.length - 1;
                    }
                    
                    displayCurrentWrongWord();
                    break;
            }
        }
    });
    
    // 每日检查需要复习的单词
    checkDailyReviews();
});

// 显示当前部分
function showSection(section) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(s => s.classList.remove('active'));
    section.classList.add('active');
}

// 设置活动导航按钮
function setActiveNavButton(button) {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

// 设置活动词汇标签
function setActiveWordTab(tab) {
    const wordTabs = document.querySelectorAll('.word-tab');
    wordTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
}

// 显示当前单词
function displayCurrentWord() {
    // 确保currentWordIndex在有效范围内
    if (currentWordIndex >= vocabularyData.length) {
        currentWordIndex = 0;
    } else if (currentWordIndex < 0) {
        currentWordIndex = vocabularyData.length - 1;
    }
    
    const currentWord = vocabularyData[currentWordIndex];
    
    // 更新UI
    document.getElementById('word-text').textContent = currentWord.word;
    document.getElementById('definition-text').textContent = currentWord.definition;
    
    // 重置卡片翻转状态
    document.getElementById('flashcard').classList.remove('flipped');
    
    // 如果设置了自动播放音频
    if (userSettings.autoAudio) {
        setTimeout(() => {
            playWordAudio(currentWord.word);
        }, 500);
    }
    
    // 如果单词是新的，标记为学习中
    if (currentWord.status === 'new') {
        currentWord.status = 'learning';
        saveVocabularyData();
    }
}

// 显示当前错题
function displayCurrentWrongWord() {
    if (wrongWords.length === 0) {
        document.getElementById('wrong-word-text').textContent = '没有错题';
        document.getElementById('wrong-definition-text').textContent = '请先添加错题';
        return;
    }
    
    // 确保currentWrongIndex在有效范围内
    if (currentWrongIndex >= wrongWords.length) {
        currentWrongIndex = 0;
    } else if (currentWrongIndex < 0) {
        currentWrongIndex = wrongWords.length - 1;
    }
    
    const wrongWordIndex = wrongWords[currentWrongIndex];
    const currentWord = vocabularyData[wrongWordIndex];
    
    // 更新UI
    document.getElementById('wrong-word-text').textContent = currentWord.word;
    document.getElementById('wrong-definition-text').textContent = currentWord.definition;
    
    // 重置卡片翻转状态
    document.getElementById('wrong-flashcard').classList.remove('flipped');
    
    // 如果设置了自动播放音频
    if (userSettings.autoAudio) {
        setTimeout(() => {
            playWordAudio(currentWord.word);
        }, 500);
    }
}

// 错题导航函数
function navigateToPrevWrongWord() {
    if (wrongWords.length === 0) return;
    
    currentWrongIndex--;
    if (currentWrongIndex < 0) {
        currentWrongIndex = wrongWords.length - 1;
    }
    
    displayCurrentWrongWord();
}

function navigateToNextWrongWord() {
    if (wrongWords.length === 0) return;
    
    currentWrongIndex++;
    if (currentWrongIndex >= wrongWords.length) {
        currentWrongIndex = 0;
    }
    
    displayCurrentWrongWord();
}

// 开始错题学习模式
function startWrongWordsStudy() {
    // 重置当前错题索引
    currentWrongIndex = 0;
    displayCurrentWrongWord();
}

// 播放单词音频
function playWordAudio(word) {
    // 使用Web Speech API进行发音
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
}

// 添加到错题本
function addToWrongWords(wordIndex) {
    vocabularyData[wordIndex].isWrong = true;
    saveVocabularyData();
    
    alert(`单词 "${vocabularyData[wordIndex].word}" 已添加到错题本！`);
    
    // 更新错题列表
    updateWrongWords();
    
    // 显示下一个单词
    if (wordIndex < vocabularyData.length - 1) {
        currentWordIndex = wordIndex + 1;
        displayCurrentWord();
    }
}

// 从错题本中移除
function removeFromWrongWords(wordIndex) {
    vocabularyData[wordIndex].isWrong = false;
    saveVocabularyData();
    
    // 更新错题列表
    updateWrongWords();
}

// 更新错题列表
function updateWrongWords() {
    // 获取所有错题
    wrongWords = vocabularyData.reduce((indices, word, index) => {
        if (word.isWrong) {
            indices.push(index);
        }
        return indices;
    }, []);
    
    // 更新错题数量
    document.getElementById('wrong-words-count').textContent = `错题数: ${wrongWords.length}`;
    
    // 更新错题列表
    const wrongList = document.getElementById('wrong-list');
    wrongList.innerHTML = '';
    
    if (wrongWords.length === 0) {
        wrongList.innerHTML = '<div class="no-wrong-words">暂无错题</div>';
    } else {
        wrongWords.forEach(index => {
            const word = vocabularyData[index];
            const wordItem = document.createElement('div');
            wordItem.className = 'wrong-word-item';
            
            wordItem.innerHTML = `
                <span class="wrong-word-text">${word.word}</span>
                <span class="wrong-word-definition">${word.definition}</span>
                <div class="wrong-word-actions">
                    <button class="wrong-word-btn play-wrong-btn" title="播放发音">
                        <i class="fas fa-volume-up"></i>
                    </button>
                    <button class="wrong-word-btn remove-wrong-btn" title="从错题本移除">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            // 添加播放发音事件
            wordItem.querySelector('.play-wrong-btn').addEventListener('click', function() {
                playWordAudio(word.word);
            });
            
            // 添加从错题本移除事件
            wordItem.querySelector('.remove-wrong-btn').addEventListener('click', function() {
                removeFromWrongWords(index);
            });
            
            // 添加点击单词跳转到学习界面
            wordItem.addEventListener('click', function(e) {
                // 忽略按钮点击
                if (e.target.closest('.wrong-word-btn')) return;
                
                currentWordIndex = index;
                showSection(document.getElementById('home-section'));
                setActiveNavButton(document.getElementById('home-btn'));
                displayCurrentWord();
            });
            
            wrongList.appendChild(wordItem);
        });
    }
    
    // 如果在错题学习模式下，但没有错题了，则返回错题本页面
    if (document.getElementById('wrong-study-section').classList.contains('active') && wrongWords.length === 0) {
        showSection(document.getElementById('wrong-section'));
        setActiveNavButton(document.getElementById('wrong-btn'));
        alert('没有更多错题！');
    }
}

// 更新单词难度
function updateWordDifficulty(wordIndex, difficultyLevel) {
    const currentWord = vocabularyData[wordIndex];
    currentWord.difficulty = difficultyLevel;
    
    // 根据难度设置下次复习时间
    const now = new Date();
    let nextReviewDays;
    
    switch (difficultyLevel) {
        case 1: // 简单
            nextReviewDays = 7 * userSettings.reviewFrequency;
            currentWord.status = currentWord.reviewCount >= 3 ? 'mastered' : 'learning';
            // 如果单词标记为已掌握，则从错题本移除
            if (currentWord.status === 'mastered' && currentWord.isWrong) {
                currentWord.isWrong = false;
                updateWrongWords();
            }
            break;
        case 3: // 一般
            nextReviewDays = 3 * userSettings.reviewFrequency;
            currentWord.status = 'learning';
            break;
        case 5: // 困难
            nextReviewDays = 1 * userSettings.reviewFrequency;
            currentWord.status = 'review';
            break;
    }
    
    now.setDate(now.getDate() + nextReviewDays);
    currentWord.nextReview = now.toISOString();
    currentWord.reviewCount++;
    
    saveVocabularyData();
}

// 开始测试
function startTest() {
    // 准备测试单词
    prepareTestWords();
    
    // 重置测试索引
    currentTestIndex = 0;
    
    // 显示第一个问题
    displayTestQuestion();
}

// 准备测试单词
function prepareTestWords() {
    // 获取需要测试的单词（优先复习和学习中的单词）
    const reviewWords = vocabularyData.filter(word => word.status === 'review');
    const learningWords = vocabularyData.filter(word => word.status === 'learning');
    const newWords = vocabularyData.filter(word => word.status === 'new');
    
    // 组合单词，优先级：复习 > 学习中 > 新单词
    testWords = [...reviewWords, ...learningWords];
    
    // 如果不够10个单词，添加新单词
    if (testWords.length < 10) {
        testWords = testWords.concat(newWords.slice(0, 10 - testWords.length));
    }
    
    // 如果还不够，添加已掌握的单词
    if (testWords.length < 10) {
        const masteredWords = vocabularyData.filter(word => word.status === 'mastered');
        testWords = testWords.concat(masteredWords.slice(0, 10 - testWords.length));
    }
    
    // 限制为10个单词并随机排序
    testWords = testWords.slice(0, 10).sort(() => Math.random() - 0.5);
}

// 显示测试问题
function displayTestQuestion() {
    const currentTestWord = testWords[currentTestIndex];
    const optionsContainer = document.getElementById('options-container');
    const resultContainer = document.getElementById('result-container');
    
    // 重置结果容器
    resultContainer.style.display = 'none';
    
    // 根据测试模式设置问题
    if (userSettings.testMode === 'en-to-zh' || 
        (userSettings.testMode === 'mixed' && Math.random() > 0.5)) {
        // 英文到中文
        document.getElementById('question-text').textContent = '选择正确的中文释义:';
        document.getElementById('test-word').textContent = currentTestWord.word;
        
        // 生成选项
        generateOptions(currentTestWord, 'definition');
    } else {
        // 中文到英文
        document.getElementById('question-text').textContent = '选择正确的英文单词:';
        document.getElementById('test-word').textContent = currentTestWord.definition;
        
        // 生成选项
        generateOptions(currentTestWord, 'word');
    }
}

// 生成测试选项
function generateOptions(correctWord, fieldType) {
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    // 获取3个错误选项
    let wrongOptions = [];
    while (wrongOptions.length < 3) {
        const randomIndex = Math.floor(Math.random() * vocabularyData.length);
        const randomWord = vocabularyData[randomIndex];
        
        // 确保不重复且不是正确答案
        if (randomWord.id !== correctWord.id && 
            !wrongOptions.some(w => w.id === randomWord.id)) {
            wrongOptions.push(randomWord);
        }
    }
    
    // 合并所有选项并随机排序
    const allOptions = [correctWord, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    // 创建选项按钮
    allOptions.forEach(option => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'option-btn';
        optionBtn.textContent = option[fieldType];
        
        // 添加点击事件
        optionBtn.addEventListener('click', function() {
            checkAnswer(option, correctWord, fieldType, this);
        });
        
        optionsContainer.appendChild(optionBtn);
    });
}

// 检查答案
function checkAnswer(selectedOption, correctOption, fieldType, buttonElement) {
    const optionButtons = document.querySelectorAll('.option-btn');
    const resultContainer = document.getElementById('result-container');
    const resultText = document.getElementById('result-text');
    
    // 禁用所有选项
    optionButtons.forEach(btn => {
        btn.disabled = true;
        
        // 标记正确答案
        if (btn.textContent === correctOption[fieldType]) {
            btn.classList.add('correct');
        }
    });
    
    // 如果选择错误，标记所选按钮
    if (selectedOption.id !== correctOption.id) {
        buttonElement.classList.add('incorrect');
        resultText.textContent = `错误! 正确答案是: ${correctOption[fieldType]}`;
        
        // 更新单词难度
        const wordIndex = vocabularyData.findIndex(w => w.id === correctOption.id);
        if (wordIndex !== -1) {
            // 增加难度
            vocabularyData[wordIndex].difficulty = Math.min(5, (vocabularyData[wordIndex].difficulty || 0) + 1);
            vocabularyData[wordIndex].status = 'review';
            
            // 设置明天复习
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            vocabularyData[wordIndex].nextReview = tomorrow.toISOString();
            
            // 添加到错题本
            vocabularyData[wordIndex].isWrong = true;
            
            saveVocabularyData();
            updateWrongWords();
        }
    } else {
        resultText.textContent = '正确!';
        
        // 更新单词难度
        const wordIndex = vocabularyData.findIndex(w => w.id === correctOption.id);
        if (wordIndex !== -1) {
            // 降低难度
            vocabularyData[wordIndex].difficulty = Math.max(1, (vocabularyData[wordIndex].difficulty || 3) - 1);
            vocabularyData[wordIndex].reviewCount++;
            
            // 如果复习次数足够且难度低，则标记为已掌握
            if (vocabularyData[wordIndex].reviewCount >= 3 && vocabularyData[wordIndex].difficulty <= 2) {
                vocabularyData[wordIndex].status = 'mastered';
                // 如果单词标记为已掌握，则从错题本移除
                if (vocabularyData[wordIndex].isWrong) {
                    vocabularyData[wordIndex].isWrong = false;
                }
            }
            
            saveVocabularyData();
            updateWrongWords();
        }
    }
    
    // 显示结果
    resultContainer.style.display = 'block';
}

// 更新进度统计
function updateProgressStats() {
    const totalWords = vocabularyData.length;
    const learnedWords = vocabularyData.filter(word => word.status !== 'new').length;
    const masteredWords = vocabularyData.filter(word => word.status === 'mastered').length;
    const reviewWords = vocabularyData.filter(word => word.status === 'review').length;
    
    document.getElementById('total-words').textContent = totalWords;
    document.getElementById('learned-words').textContent = learnedWords;
    document.getElementById('mastered-words').textContent = masteredWords;
    document.getElementById('review-words').textContent = reviewWords;
    
    // 更新进度条
    const progressPercentage = Math.round((masteredWords / totalWords) * 100);
    document.getElementById('progress-bar').style.width = `${progressPercentage}%`;
    document.getElementById('progress-percentage').textContent = progressPercentage;
}

// 显示词汇列表
function displayWordList(filter) {
    const wordList = document.getElementById('word-list');
    wordList.innerHTML = '';
    
    let filteredWords;
    
    switch (filter) {
        case 'mastered':
            filteredWords = vocabularyData.filter(word => word.status === 'mastered');
            break;
        case 'learning':
            filteredWords = vocabularyData.filter(word => word.status === 'learning');
            break;
        case 'review':
            filteredWords = vocabularyData.filter(word => word.status === 'review');
            break;
        default:
            filteredWords = vocabularyData;
    }
    
    filteredWords.forEach(word => {
        const wordItem = document.createElement('div');
        wordItem.className = `word-item ${word.status}${word.isWrong ? ' wrong' : ''}`;
        wordItem.textContent = word.word;
        
        // 添加点击事件，跳转到该单词
        wordItem.addEventListener('click', function() {
            currentWordIndex = vocabularyData.findIndex(w => w.id === word.id);
            displayCurrentWord();
            showSection(document.getElementById('home-section'));
            setActiveNavButton(document.getElementById('home-btn'));
        });
        
        wordList.appendChild(wordItem);
    });
}

// 检查每日需要复习的单词
function checkDailyReviews() {
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // 获取当天日期
    
    // 获取上次检查日期
    const lastCheckDate = localStorage.getItem('lastReviewCheck');
    
    // 如果今天还没检查过
    if (lastCheckDate !== today) {
        // 更新需要复习的单词
        vocabularyData.forEach(word => {
            if (word.nextReview && new Date(word.nextReview) <= now) {
                word.status = 'review';
            }
        });
        
        saveVocabularyData();
        
        // 记录今天已检查
        localStorage.setItem('lastReviewCheck', today);
    }
}

// 加载用户设置
function loadSettings() {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
        userSettings = JSON.parse(savedSettings);
        
        // 更新设置界面
        document.getElementById('daily-goal').value = userSettings.dailyGoal;
        document.getElementById('review-frequency').value = userSettings.reviewFrequency;
        document.getElementById('test-mode').value = userSettings.testMode;
        document.getElementById('auto-audio').checked = userSettings.autoAudio;
    }
}

// 保存用户设置
function saveSettings() {
    localStorage.setItem('userSettings', JSON.stringify(userSettings));
}

// 重置学习进度
function resetProgress() {
    vocabularyData.forEach(word => {
        word.status = 'new';
        word.difficulty = 0;
        word.nextReview = null;
        word.reviewCount = 0;
        word.isWrong = false;
    });
    
    saveVocabularyData();
    updateProgressStats();
    updateWrongWords();
    
    // 重置当前索引
    currentWordIndex = 0;
    currentWrongIndex = 0;
    
    displayCurrentWord();
    
    alert('学习进度已重置！');
}

// PWA 安装提示功能
let deferredPrompt;

// 监听 beforeinstallprompt 事件
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('[PWA] beforeinstallprompt 事件触发');
    // 阻止默认的安装提示
    e.preventDefault();
    // 保存事件，以便稍后使用
    deferredPrompt = e;
    // 显示自定义安装按钮
    showInstallPrompt();
});

// 监听 appinstalled 事件
window.addEventListener('appinstalled', (evt) => {
    console.log('[PWA] 应用已安装');
    hideInstallPrompt();
});

// 显示安装提示
function showInstallPrompt() {
    // 检查是否已经显示过安装提示
    const hasShownPrompt = localStorage.getItem('pwa-install-prompt-shown');
    
    if (!hasShownPrompt && deferredPrompt) {
        // 创建安装提示横幅
        const installBanner = document.createElement('div');
        installBanner.id = 'install-banner';
        installBanner.innerHTML = `
            <div class="install-content">
                <div class="install-text">
                    <strong>📱 安装词汇助手</strong>
                    <p>将应用安装到桌面，随时随地学习词汇！</p>
                </div>
                <div class="install-buttons">
                    <button id="install-btn" class="install-btn">安装</button>
                    <button id="dismiss-btn" class="dismiss-btn">不再提示</button>
                </div>
            </div>
        `;
        
        // 添加CSS样式
        const style = document.createElement('style');
        style.textContent = `
            #install-banner {
                position: fixed;
                bottom: 20px;
                left: 20px;
                right: 20px;
                background: linear-gradient(135deg, #3498db, #2980b9);
                color: white;
                padding: 16px;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                animation: slideUp 0.3s ease-out;
            }
            
            .install-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 16px;
            }
            
            .install-text strong {
                font-size: 16px;
                display: block;
                margin-bottom: 4px;
            }
            
            .install-text p {
                font-size: 14px;
                margin: 0;
                opacity: 0.9;
            }
            
            .install-buttons {
                display: flex;
                gap: 8px;
                flex-shrink: 0;
            }
            
            .install-btn, .dismiss-btn {
                padding: 8px 16px;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .install-btn {
                background: rgba(255,255,255,0.2);
                color: white;
                border: 1px solid rgba(255,255,255,0.3);
            }
            
            .install-btn:hover {
                background: rgba(255,255,255,0.3);
            }
            
            .dismiss-btn {
                background: transparent;
                color: rgba(255,255,255,0.8);
                border: 1px solid rgba(255,255,255,0.2);
            }
            
            .dismiss-btn:hover {
                background: rgba(255,255,255,0.1);
                color: white;
            }
            
            @keyframes slideUp {
                from {
                    transform: translateY(100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            @media (max-width: 768px) {
                .install-content {
                    flex-direction: column;
                    text-align: center;
                }
                
                .install-buttons {
                    width: 100%;
                    justify-content: center;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(installBanner);
        
        // 安装按钮点击事件
        document.getElementById('install-btn').addEventListener('click', async () => {
            if (deferredPrompt) {
                // 显示安装提示
                deferredPrompt.prompt();
                // 等待用户响应
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`[PWA] 用户选择: ${outcome}`);
                
                // 清除 deferredPrompt
                deferredPrompt = null;
                hideInstallPrompt();
                
                // 记录用户已看过提示
                localStorage.setItem('pwa-install-prompt-shown', 'true');
            }
        });
        
        // 不再提示按钮点击事件
        document.getElementById('dismiss-btn').addEventListener('click', () => {
            hideInstallPrompt();
            localStorage.setItem('pwa-install-prompt-shown', 'true');
        });
        
        // 3秒后自动显示（为了不太突兀）
        setTimeout(() => {
            const banner = document.getElementById('install-banner');
            if (banner) {
                banner.style.display = 'block';
            }
        }, 3000);
    }
}

// 隐藏安装提示
function hideInstallPrompt() {
    const installBanner = document.getElementById('install-banner');
    if (installBanner) {
        installBanner.style.animation = 'slideDown 0.3s ease-out';
        setTimeout(() => {
            installBanner.remove();
        }, 300);
    }
}

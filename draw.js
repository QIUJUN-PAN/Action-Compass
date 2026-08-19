// 创建了一个空字符串，记录当前抽中的分类
let currentCategory="";
let currentTask = "";

function showLoading()
{
    document.getElementById("loading").style.display = "flex";
    document.getElementById("result").style.display = "none";
    document.getElementById("result").innerHTML = "";
}

function hideLoading()
{
    document.getElementById("loading").style.display = "none";
}

// 避免重新抽到同一个分类/任务
function getRandomCategory()
{
    const categories = Object.keys(tasks);

    if (categories.length === 1)
    {
        return categories[0];
    }

    let category;

    do
    {
        category =
            categories[
                Math.floor(Math.random() * categories.length)
            ];
    }
    while (category === currentCategory);

    return category;
}

function getRandomTask(taskList)
{
    if (taskList.length === 1)
    {
        return taskList[0];
    }

    let task;

    do
    {
        task =
            taskList[
                Math.floor(Math.random() * taskList.length)
            ];
    }
    while (task === currentTask);

    return task;
}

function drawCategory()
{
    showLoading();

    setTimeout(function()
    {
        const categories = Object.keys(tasks);

        if (categories.length === 0)
        {
            hideLoading();

            document.getElementById("result").innerHTML = `
            <div class="result-letter">
                <p class="letter-label">
                    神様からのお知らせ
                </p>

                <h2>
                    まだ「やりたいこと」が登録されていません。
                </h2>

                <a href="manage.html" class="action-button">
                    やりたいことを追加する →
                </a>
            </div>
            `;

            document.getElementById("result").style.display = "block";
            
            return;
        }
        
        const category = getRandomCategory();

        currentCategory = category;

        hideLoading();

        document.getElementById("result").innerHTML = `
            <div class="result-letter">

                <p class="letter-label">
                    神様からの提案：
                </p>

                <h2>${category}</h2>
            
            </div>
            <div class="result-actions">

                <button id="accept-category" class="action-button">
                    これにする🤲
                </button>

                <button id="change-category" class="action-button">
                    もう一度💔
                </button>

            </div>
        `;

        document.getElementById("result").style.display = "block";

        bindCategoryButtons();

    }, 2000);
}

function bindCategoryButtons()
{
    const acceptButton =
        document.getElementById("accept-category");

    const changeButton =
        document.getElementById("change-category");

    acceptButton.addEventListener("click", function()
    {
        drawTask();
    });

    changeButton.addEventListener("click", function()
    {
        drawCategory();
    });
}

function drawTask()
{
    showLoading();

    setTimeout(function()
    {
        const taskList = tasks[currentCategory];

        if (
            taskList === undefined ||
            taskList.length === 0
        )
        {
            hideLoading();

            document.getElementById("result").innerHTML = `
                <p>このカテゴリには、まだタスクがありません。</p>
            `;

            return;
        }

        const task = getRandomTask(taskList);

        currentTask = task;

        hideLoading();

        document.getElementById("result").innerHTML = `
            <div class="result-letter">

                <p class="letter-label">
                    さあ、スマホを置いて：
                </p>

                <h2>${task}</h2>

            </div>

            <div class="result-actions">

                    <button id="change-task" class="action-button">
                        別のことにする💔
                    </button>

                    <a href="coming-soon.html"  class="action-button">
                        やってみる🤩
                    </a>
            </div>
        `;

        document.getElementById("result").style.display="block";

        bindTaskButtons();

    }, 1000);
}

function bindTaskButtons()
{
    const changeTaskButton =
        document.getElementById("change-task");

    changeTaskButton.addEventListener("click", function()
    {
        drawTask();
    });
}

drawCategory();
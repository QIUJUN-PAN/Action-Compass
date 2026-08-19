// 普通模式(展示分类和任务)
let isEditing = false;

// 根据当前模式,重新生成分类和任务(编辑功能和取消功能使用)
function renderTasks()
{
    // 管理界面为空白时提醒用户
    const categories = Object.keys(tasks);

    if (categories.length === 0)
    {
        document.getElementById("task-list").innerHTML = `
        <div class="empty-state">
            <p>まだカテゴリとタスクがありません。</p>
            <a href="manage.html">「やりたいことを追加」からタスクを追加してください。</a>
        </div>
        `;
        return;
    }

    // 准备一个空白html页面
    let html = "";

    // 在页面上列出分类(html+=)
    for (const category in tasks)
    {   
        // 编辑模式
        if (isEditing)
        {
            html+=`
             <div class="category">
                <div class="edit-category-row">
                  <input
                    type="checkbox"
                    class="select-category"
                  >

                  <input
                    class="edit-category"
                    data-old-category="${category}"
                    value="${category}"
                  >
                </div>
            `;
        }
        // 普通模式
        else
        {
             html += `
            <div class="category">
                <h2>${category}</h2>
            `;
        }
        
        const taskList=tasks[category];
        for (const [index,task] of taskList.entries())
        {
            if (isEditing)
            {
                 html += `
                <div class="edit-task-row">
                  <input
                    type="checkbox"
                    class="select-task"
                  >

                  <input
                    class="edit-task"
                    data-category="${category}"
                    data-index="${index}"
                    value="${task}"
                  >
                </div>
                `;
            }
            else
            {
                html += `
                <p>${task}</p>
                `;
            }
        }

        html +=`
        </div>
        `;
    }

    document.getElementById("task-list").innerHTML=html;

    if (isEditing)
    {
        bindSelectionEvents();
        updateSelectAllCheckbox();
    }

}

// “全选”自动跟随下面的状态
function updateSelectAllCheckbox()
{
    const allTaskCheckboxes =
        document.querySelectorAll(".select-task");

    const checkedTaskCheckboxes =
        document.querySelectorAll(".select-task:checked");
    
    // 一个都没选→ 空框
    if (allTaskCheckboxes.length === 0)
    {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
        return;
    }
    
    // 全部选中→ 打勾
    selectAllCheckbox.checked =
        checkedTaskCheckboxes.length > 0 &&
        checkedTaskCheckboxes.length === allTaskCheckboxes.length;
    
    // 只选了一部分→ 横线框
    selectAllCheckbox.indeterminate =
        checkedTaskCheckboxes.length > 0 &&
        checkedTaskCheckboxes.length < allTaskCheckboxes.length;
}

// 取消所有checkbox里的钩和横线（全选功能用）
function clearAllSelections()
{
    const allCheckboxes =
        document.querySelectorAll(
            ".select-category, .select-task"
        );

    allCheckboxes.forEach(function(checkbox)
    {
        checkbox.checked = false;
        checkbox.indeterminate = false;
    });

    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
}

// 封装选择框的联动功能
function bindSelectionEvents()
{
    // 找到所有分类选择框
    const categoryCheckboxes = document.querySelectorAll(".select-category");

    categoryCheckboxes.forEach(function(categoryCheckbox)
    {
        categoryCheckbox.addEventListener("change",function()
        {
            // 找到当前分类区域
            const categoryElement = categoryCheckbox.closest(".category");

            // 找到该分类下的所有任务选择框
            const taskCheckboxes = categoryElement.querySelectorAll(".select-task");

            // 分类勾选状态同步给所有任务
            taskCheckboxes.forEach(function(taskCheckbox)
            {
                taskCheckbox.checked = categoryCheckbox.checked;
            });

            updateSelectAllCheckbox();
        });
    });

    // 找到所有任务选择框
    const taskCheckboxes = document.querySelectorAll(".select-task");
    
    taskCheckboxes.forEach(function(taskCheckbox)
    {
        taskCheckbox.addEventListener("change", function()
        {
            const categoryElement =
                taskCheckbox.closest(".category");

            const categoryCheckbox =
                categoryElement.querySelector(".select-category");

            const tasksInCategory =
                categoryElement.querySelectorAll(".select-task");

            const checkedTasks =
                categoryElement.querySelectorAll(".select-task:checked");

            // 所有任务都选中时，分类也选中
            categoryCheckbox.checked =
                tasksInCategory.length > 0 &&
                tasksInCategory.length === checkedTasks.length;

            // 只选中部分任务时，分类框显示横线状态
            categoryCheckbox.indeterminate =
                checkedTasks.length > 0 &&
                checkedTasks.length < tasksInCategory.length;

            updateSelectAllCheckbox();
        });
    });
};

// 把组成newTasks的代码封装成函数(保存修改和删除使用)
function collectTasksFromEditor(excludeSelected)
{
    const newTasks = {};

    // 找到页面上所有分类区域
    const categoryElements = document.querySelectorAll(".category");

    // 逐个处理分类
    categoryElements.forEach(function(categoryElement)
    {
        // 在当前分类查找编辑区域
        const categoryCheckbox = categoryElement.querySelector(".select-category");
        
        // 删除模式下,如果整个分类被选中,就跳过整个分类不放入newTasks
         if (
            excludeSelected &&
            categoryCheckbox.checked
        )
        {
            return;
        }
        
        // 保存模式下，读取新分类
        const categoryInput = categoryElement.querySelector(".edit-category");
        const newCategory = categoryInput.value.trim();

        // 空分类不放入newTasks
        if (newCategory === "")
        {
            return;
        }
        
        // 为当前分类准备一个新的任务数组
        const newTaskList = [];
        
        // 找到当前分类下的所有任务行
        const taskRows = categoryElement.querySelectorAll(".edit-task-row");
        
        // 逐个处理任务
        taskRows.forEach(function(taskRow)
        {
            const taskCheckbox = taskRow.querySelector(".select-task");
            
            // 删除模式下，被选中的任务不加入新数组
            if (
                excludeSelected &&
                taskCheckbox.checked
            )
            {
                return;
            }
            
            //保存模式下，读取修改后的任务文字
            const taskInput = taskRow.querySelector(".edit-task");
            const newTask = taskInput.value.trim();

            // 空任务不保存，也避免同一分类内出现重复任务
            if (
                newTask !== "" &&
                !newTaskList.includes(newTask)
            )
            {
                newTaskList.push(newTask);
            }
        });

         // 有有效任务时，才保留这个分类
        if (newTaskList.length > 0)
        {
            // 避免两个分类被修改成同一个名字时互相覆盖
            if (newTasks[newCategory] === undefined)
            {
                newTasks[newCategory] = [];
            }
        
            // 逐个读取当前分类整理好的任务。如果目标分类中还没有这个任务，就添加进去。
            newTaskList.forEach(function(task)
            {
                if (!newTasks[newCategory].includes(task))
                {
                    newTasks[newCategory].push(task);
                }
            });
        }
    });

    return newTasks;
} 

// 新增下拉现有分类的功能
function renderCategoryOptions()
{
    const categorySelect =
        document.getElementById("category-select");

    let options = `
        <option value="">
            既存のカテゴリから選択
        </option>
    `;

    const categories = Object.keys(tasks);

    categories.forEach(function(category)
    {
        options += `
            <option value="${category}">
                ${category}
            </option>
        `;
    });

    categorySelect.innerHTML = options;
}

// 把编辑按钮、取消和保存修改按钮中UI相关的代码封装成函数
function updateEditingUI()
{
    if (isEditing)
    {
        // 隐藏编辑按钮
        editButton.style.display = "none";
        // 显示保存和取消按钮
        editActions.style.display = "block";
        // 隐藏新增任务卡片
        document.getElementById("add-task").style.display = "none";
    }
    else
    {
        editButton.style.display = "inline-block";
        editActions.style.display = "none";
        document.getElementById("add-task").style.display = "block";
    }
};

const saveButton = document.getElementById("save-task");
const editButton = document.getElementById("edit-button");
const saveEditButton = document.getElementById("save-edit");
const cancelEditButton = document.getElementById("cancel-edit");
const editActions = document.getElementById("edit-actions");
const deleteSelectedButton = document.getElementById("delete-selected"); 
const selectAllCheckbox = document.getElementById("select-all")

// manage页面的新增功能
saveButton.addEventListener("click",function(){
    // 读取新增的分类和任务的数值
    const selectedCategory = document.getElementById("category-select").value;
    
    const newCategory = document.getElementById("new-category-input").value.trim();

    const taskText = document.getElementById("task-input").value;

    let category = "";

    if (newCategory !== "")
    {
        category = newCategory;
    }
    else
    {
        category = selectedCategory;
    }

    // 按换行拆分任务，清理空格，并过滤空白行
    const newTasks = taskText
    // 按换行符拆开
        .split("\n")
    // 逐个清除开头和结尾的空格
        .map(function(task)
        {
            return task.trim();
        })
    // 过滤空白行
        .filter(function(task)
        {
            return task !== "";
        });
    
    // 输入验证，防止输入空白数据
    if (category === ""||newTasks.length === 0)
    {
        alert("カテゴリを選択または入力し、タスクを1つ以上入力してください。");
        return;
    }
    
    // 保存任务
    // step1、判断分类有没有存在
    if (tasks[category] === undefined)
    {
    // step2、如果没有就加进去
        tasks[category] = [];
    }

    // step3、把任务放进去 
    const addedTasks = []; // 记录成功添加的任务
    const duplicateTasks = []; // 记录因为重复而跳过的任务

    newTasks.forEach(function(task)
    {
        if (tasks[category].includes(task))
        {
            duplicateTasks.push(task);
        }
        else
        {
            tasks[category].push(task);
            addedTasks.push(task);
        }
    });
    
     // 一个新任务都没有加入时，无需保存
    if (addedTasks.length === 0)
    {
        alert("入力したタスクはすでに登録されています。");
        return;
    }

    // 把最新数据保存到localstorage
    saveTasks();

    // 新分类加入后，更新下拉框
    renderCategoryOptions();

    // 重新在下方显示出所有任务
    renderTasks();

    // 保留当前分类，方便继续添加同类任务
    document.getElementById("category-select").value = category;
    document.getElementById("new-category-input").value = "";
    document.getElementById("task-input").value = "";

    // 验证添加功能
    if (duplicateTasks.length === 0)
    {
        alert(` ${addedTasks.length} 件のタスクを追加しました。`);
    }
    else
    {
        alert(
            ` ${addedTasks.length} 件のタスクを追加しました。` +
            `重複している ${duplicateTasks.length} 件のタスクをスキップしました。`
        );
    }
});

// 进入编辑模式
editButton.addEventListener("click", function()
{
    isEditing = true;

    renderTasks();
    
    updateEditingUI();
});

// 放弃修改,返回普通模式
cancelEditButton.addEventListener("click",function()
{
    isEditing = false;

    renderTasks()
    
    updateEditingUI();
});

// 保存修改功能
saveEditButton.addEventListener("click", function()
{
    // 收集全部内容，不排除任何项目
    tasks = collectTasksFromEditor(false);

    saveTasks();

    isEditing = false;

    renderTasks();

    updateEditingUI();
});

// 删除所选功能
deleteSelectedButton.addEventListener("click",function()
{
    const selectedItems =
        document.querySelectorAll(
            ".select-category:checked, .select-task:checked"
        );

    if (selectedItems.length === 0)
    {
        alert("削減しようとするカテゴリまたはタスクを選択してください。");
        return;
    }

    let confirmMessage = "選択された内容を削減しますか。";

    if (selectAllCheckbox.checked)
    {
        confirmMessage = "すべての内容を削減しますか。";
    }

    const shouldDelete = confirm(confirmMessage);

    if (!shouldDelete)
    {
        // 取消删除所有任务时把所有任务的钩取消
        clearAllSelections();
        return;
    }

    // 重新收集数据，并排除所有被选中的项目
    tasks = collectTasksFromEditor(true);

    saveTasks();

    // 保持在编辑模式，重新生成页面
    renderTasks();

    // 全选并删除后取消全选按钮上的钩
    clearAllSelections();
}); 

// 全选功能：勾选“全选”框时，所有分类和所有任务都一起被勾选；取消“全选”时，所有分类和任务都取消勾选。
selectAllCheckbox.addEventListener("change",function()
{
    const allCheckboxes = document.querySelectorAll(".select-category, .select-task");

    allCheckboxes.forEach(function(checkbox)
    {
        // 把当前复选框的勾选状态，设置成和“全选框”一样
        checkbox.checked = selectAllCheckbox.checked;
        checkbox.indeterminate = false;
    });
});

renderTasks();
renderCategoryOptions();




package org.summer.view.widget;
// 摘要:
//     为希望通过 WeakEvent 模式和 System.Windows.WeakEventManager 接收事件的类提供事件侦听支持。
public interface IWeakEventListener
{
    // 摘要:
    //     接收集中事件管理器中的事件。
    //
    // 参数:
    //   managerType:
    //     调用此方法的 System.Windows.WeakEventManager 的类型。
    //
    //   sender:
    //     发出该事件的对象。
    //
    //   e:
    //     事件数据。
    //
    // 返回结果:
    //     如果侦听器已对事件进行了处理，则为 true。 在 WPF 中，System.Windows.WeakEventManager 处理为侦听器未处理的事件注册侦听器被视为错误。
    //     无论如何，如果此方法接收到它未能识别或处理的事件，它都应该返回 false。
    boolean ReceiveWeakEvent(Type managerType, Object sender, EventArgs e);
}
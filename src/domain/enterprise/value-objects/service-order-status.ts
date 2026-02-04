export type ServiceOrderStatusType = 'PENDING' | 'WAITING_PAYMENT' | 'PAID' | 'CANCELED' | 'FAILED';

export class ServiceOrderStatus {
    private constructor(private readonly value: ServiceOrderStatusType){}

    static pending(): ServiceOrderStatus {
        return new ServiceOrderStatus('PENDING');
    }

    static waitingPayment(): ServiceOrderStatus {
        return new ServiceOrderStatus('WAITING_PAYMENT');
    }
    
    static paid(): ServiceOrderStatus {
        return new ServiceOrderStatus('PAID');
    }

    static canceled(): ServiceOrderStatus {
        return new ServiceOrderStatus('CANCELED');
    }
    
    static failed(): ServiceOrderStatus {
        return new ServiceOrderStatus('FAILED');
    }

    isPending(): boolean {
        return this.value === 'PENDING';
    }

    isWaitingPayment(): boolean {
        return this.value === 'WAITING_PAYMENT';
    }

    isPaid(): boolean {
        return this.value === 'PAID';
    }
}
